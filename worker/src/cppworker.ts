import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { spawn } from 'child_process';

// ✅ Redis connection for BullMQ
const connection = new IORedis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null,
});

// ✅ BullMQ Worker
const worker = new Worker(
  'cpp-judge',
  async (job) => {
    const { code, testCode } = job.data;

    return new Promise((resolve) => {
      const docker = spawn('docker', [
        'run',
        '--rm',
        '-i',
        'judge-cpp',
      ]);

      let output = '';
      let error = '';
      let settled = false;

      const timeoutId = setTimeout(() => {
        if (!settled) {
          settled = true;
          docker.kill();
          resolve({
            status: 'timeout',
            message: 'Execution timed out (25s)',
            output: '',
            error: 'Time Limit Exceeded',
          });
        }
      }, 25000);

      docker.stdout.on('data', (data) => {
        output += data.toString();
      });

      docker.stderr.on('data', (data) => {
        error += data.toString();
      });

      docker.on('close', (code) => {
        clearTimeout(timeoutId);
        if (settled) return;
        settled = true;

        if (code === 0) {
          if (output.includes('success')) {
            resolve({
              status: 'success',
              message: 'All test cases passed',
              output: output.trim(),
              error: '',
            });
          } else {
            resolve({
              status: 'fail',
              message: 'Unknown result',
              output: output.trim(),
              error: '',
            });
          }
        } else {
          if (error) {
            resolve({
              status: 'error',
              message: 'Runtime Error',
              output: '',
              error: error.trim(),
            });
          } else {
            resolve({
              status: 'fail',
              message: 'Test case failed',
              output: output.trim(),
              error: '',
            });
          }
        }
      });

      const fullCode = `${code}\n\n// TEST CODE SEPARATOR\n\n${testCode}`;
      docker.stdin.write(fullCode);
      docker.stdin.end();
    });
  },
  { connection }
);
