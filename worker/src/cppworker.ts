import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { spawn } from 'child_process';

// ✅ Proper Redis connection for BullMQ worker
const connection = new IORedis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null, 
});
const worker = new Worker('cpp-judge', async (job) => {
  const { code, testCode } = job.data;

  return new Promise((resolve) => {
    const docker = spawn('docker', [
      'run',
      '--rm',
      '-i',
      'judge-cpp'
    ]);

    let output = '';
    let error = '';
    let timeoutId: NodeJS.Timeout;

    // Set timeout (e.g., 5 seconds)
    timeoutId = setTimeout(() => {
      docker.kill();
      resolve({ 
        status: "timeout",
        message: "Execution timed out (5s)",
        output: "",
        error: "Time Limit Exceeded"
      });
    }, 15000);

    docker.stdout.on('data', (data) => output += data.toString());
    docker.stderr.on('data', (data) => error += data.toString());

    docker.on('close', (code) => {
      clearTimeout(timeoutId);
      
      // Handle different scenarios
      if (code === 0) {
        // Successful execution
        if (output.includes("success")) {
          resolve({
            status: "success",
            message: "All test cases passed",
            output: output.trim(),
            error: ""
          });
        } else {
          // This case shouldn't happen if testcode is properly structured
          resolve({
            status: "fail",
            message: "Unknown result",
            output: output.trim(),
            error: ""
          });
        }
      } else {
        // Failed execution
        if (error) {
          // Runtime error
          resolve({
            status: "error",
            message: "Runtime Error",
            output: "",
            error: error.trim()
          });
        } else {
          // Test case failure (exit code 1 from test harness)
          resolve({
            status: "fail",
            message: "Test case failed",
            output: output.trim(),
            error: ""
          });
        }
      }
    });

    // Combine user code and test code with clear separation
    const fullCode = `${code}\n\n// TEST CODE SEPARATOR\n\n${testCode}`;
    docker.stdin.write(fullCode);
    docker.stdin.end();
  });
}, { connection });
