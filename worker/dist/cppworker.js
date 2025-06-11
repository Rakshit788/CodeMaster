"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs = __importStar(require("fs/promises"));
function normalizeforDocker(hostpath) {
    let p = hostpath.replace(/\\/g, '/');
    const m = /^([A-Za-z]):\//.exec(p);
    if (m) {
        const drive = m[1].toLocaleLowerCase();
        p = `/${drive}${p.slice(2)}`;
    }
    return p;
}
const connection = { host: 'redis', port: 6379 };
const worker = new bullmq_1.Worker('cppworker', async (job) => {
    console.log('received data', job.data);
    const workdir = path_1.default.join(os_1.default.tmpdir(), job.data.jobid);
    await fs.mkdir(workdir, { recursive: true });
    const sourcefile = path_1.default.join(workdir, 'solution.cpp');
    await fs.writeFile(sourcefile, job.data.code);
    const hostMount = normalizeforDocker(workdir);
    const result = await new Promise(resolve => {
        (0, child_process_1.execFile)('docker', [
            'run',
            '--rm',
            '-v', `${hostMount}:/usr/src/app`,
            'judge-cpp:latest',
            'solution.cpp' // THIS is $1 inside runner.sh
        ], { timeout: 30000, maxBuffer: 1024 * 1024 }, async (err, stdout, stderr) => {
            await fs.rm(workdir, { recursive: true, force: true });
            if (err && !stdout) {
                return resolve({ status: 'error', message: stderr || err.message });
            }
            try {
                const data = JSON.parse(stdout);
                return resolve(data);
            }
            catch (e) {
                return resolve({ status: 'error', message: `Failed to parse output: ${stdout}` });
            }
        });
    });
}, {
    connection: { url: process.env.REDIS_URL || "redis://redis:6379" || 'http://localhost:6379' },
});
