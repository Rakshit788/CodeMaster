import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { spawn } from 'child_process';

// ✅ Proper Redis connection for BullMQ worker
const connection = new IORedis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null, // 👈 THIS fixes the error
});

const worker = new Worker('cpp-judge', async (job) => {
  const code = job.data.code;

  return new Promise((resolve) => {
    const docker = spawn('docker', [
      'run',
      '--rm',
      '-i',
      'judge-cpp'
    ]);

    let output = '';
    let error = '';

    docker.stdout.on('data', (data) => output += data.toString());
    docker.stderr.on('data', (data) => error += data.toString());

    docker.on('close', (code) => {
      if (code !== 0) {
        return resolve({ status: "error", message: error });
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        resolve({ status: "error", message: output });
      }
    });

    docker.stdin.write(code);
    docker.stdin.end();
  });
}, { connection });

console.log("🚀 cpp-judge worker is ready");
