import { Queue } from 'bullmq';
import { connection } from './connection';

export const codeQueue = new Queue('code-runner', { connection });

codeQueue.on('progress', (job) => {
  console.log(`Job ${job.id} completed with result: ${job.returnvalue}`);
});