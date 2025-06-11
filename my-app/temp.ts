// /scripts/checkJob.ts
import { Queue } from 'bullmq';

const queue = new Queue('cpp-judge', {
  connection: {
    host: '127.0.0.1', // or 'redis' if you're inside Docker
    port: 6379
  }
});

async function main() {
  const jobId = process.argv[2]; // pass jobId as CLI arg

  if (!jobId) {
    console.error('Missing job ID');
    process.exit(1);
  }

  const job = await queue.getJob(jobId);
  if (!job) {
    console.log('❌ Job not found.');
    return;
  }

  const state = await job.getState();
  console.log(`✅ Job state: ${state}`);
  console.log(`Return value:`, job.returnvalue);
}

main();
