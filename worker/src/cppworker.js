"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bullmq_1 = require("bullmq");
var child_process_1 = require("child_process");
var path_1 = require("path");
var os_1 = require("os");
var fs = require("fs/promises");
function normalizeforDocker(hostpath) {
    var p = hostpath.replace(/\\/g, '/');
    var m = /^([A-Za-z]):\//.exec(p);
    if (m) {
        var drive = m[1].toLocaleLowerCase();
        p = "/".concat(drive).concat(p.slice(2));
    }
    return p;
}
var connection = { host: 'redis', port: 6379 };
var worker = new bullmq_1.Worker('cppworker', function (job) { return __awaiter(void 0, void 0, void 0, function () {
    var workdir, sourcefile, hostMount, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('received data', job.data);
                workdir = path_1.default.join(os_1.default.tmpdir(), job.data.jobid);
                return [4 /*yield*/, fs.mkdir(workdir, { recursive: true })];
            case 1:
                _a.sent();
                sourcefile = path_1.default.join(workdir, 'solution.cpp');
                return [4 /*yield*/, fs.writeFile(sourcefile, job.data.code)];
            case 2:
                _a.sent();
                hostMount = normalizeforDocker(workdir);
                return [4 /*yield*/, new Promise(function (resolve) {
                        (0, child_process_1.execFile)('docker', [
                            'run',
                            '--rm',
                            '-v',
                            "".concat(hostMount, ":/usr/src/app"),
                            'judge-cpp:latest',
                            'solution.cpp' // THIS is $1 inside runner.sh
                        ], { timeout: 30000, maxBuffer: 1024 * 1024 }, function (err, stdout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
                            var data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs.rm(workdir, { recursive: true, force: true })];
                                    case 1:
                                        _a.sent();
                                        if (err && !stdout) {
                                            return [2 /*return*/, resolve({ status: 'error', message: stderr || err.message })];
                                        }
                                        try {
                                            data = JSON.parse(stdout);
                                            return [2 /*return*/, resolve(data)];
                                        }
                                        catch (e) {
                                            return [2 /*return*/, resolve({ status: 'error', message: "Failed to parse output: ".concat(stdout) })];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            case 3:
                result = _a.sent();
                return [2 /*return*/];
        }
    });
}); }, {
    connection: { url: process.env.REDIS_URL || "redis://redis:6379" }
});
