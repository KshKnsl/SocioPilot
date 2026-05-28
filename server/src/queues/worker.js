import { Worker } from 'bullmq';
import { bullmqConnection } from '../config/redis.js';
import { JOBS_QUEUE_NAME } from './index.js';
import { publishPostById } from '../services/postPublisher.js';

export const jobsWorker = bullmqConnection
  ? new Worker(
      JOBS_QUEUE_NAME,
      async (job) => {
        console.log('Processing job', job.id, job.name, job.data);

        if (job.name === 'post_publish') {
          await publishPostById(job.data.postId, job.data.userId);
          return { processed: true, type: 'post_publish', postId: job.data.postId };
        }

        throw new Error(`Unsupported job type: ${job.name}`);
      },
      { connection: bullmqConnection }
    )
  : null;

if (jobsWorker) {
  jobsWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  jobsWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
} else {
  console.log('BullMQ worker disabled: no Redis configuration found');
}
