import { Queue } from 'bullmq';

export const jobQueue = new Queue('cpp-judge', {
  connection: { url: process.env.REDIS_URL }
  ,
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false
  }
});
