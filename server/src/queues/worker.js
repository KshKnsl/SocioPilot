import { Worker } from 'bullmq';
import redisUrl from '../config/redis.js';

export const jobsWorker = new Worker(
  'jobs',
  async (job) => {
    console.log('Processing job', job.id, job.name, job.data);
    return { processed: true };
  },
  { connection: redisUrl }
);

jobsWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

jobsWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
