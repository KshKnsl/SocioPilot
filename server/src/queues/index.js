import { Queue } from 'bullmq';
import { bullmqConnection } from '../config/redis.js';

export const JOBS_QUEUE_NAME = 'jobs';
const POST_PUBLISH_JOB = 'post_publish';

export const jobsQueue = bullmqConnection ? new Queue(JOBS_QUEUE_NAME, { connection: bullmqConnection }) : null;

if (jobsQueue) {
  jobsQueue.on('error', (err) => {
    console.error('BullMQ queue error', err);
  });

  console.log('BullMQ queue initialized');
} else {
  console.log('BullMQ queue disabled: no Redis configuration found');
}

export function getPostPublishJobId(postId) {
  return `${POST_PUBLISH_JOB}:${postId}`;
}

export async function schedulePostPublish(postId, userId, runAt) {
  if (!jobsQueue) {
    console.warn('Skipping post scheduling because BullMQ is disabled');
    return null;
  }

  const targetTime = new Date(runAt).getTime();
  if (Number.isNaN(targetTime)) {
    throw new Error('Invalid schedule time');
  }

  const delay = Math.max(0, targetTime - Date.now());
  return jobsQueue.add(
    POST_PUBLISH_JOB,
    { postId: String(postId), userId: String(userId) },
    {
      jobId: getPostPublishJobId(postId),
      delay,
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 5000 },
    }
  );
}

export async function removeScheduledPostJob(postId) {
  if (!jobsQueue) {
    return false;
  }

  const job = await jobsQueue.getJob(getPostPublishJobId(postId));
  if (job) {
    await job.remove();
    return true;
  }
  return false;
}

export async function getQueueStats() {
  if (!jobsQueue) {
    return {
      waiting: 0,
      active: 0,
      delayed: 0,
      completed: 0,
      failed: 0,
    };
  }

  const counts = await jobsQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
  return {
    waiting: counts.waiting || 0,
    active: counts.active || 0,
    delayed: counts.delayed || 0,
    completed: counts.completed || 0,
    failed: counts.failed || 0,
  };
}

export const addJob = (name, data, opts = {}) => {
  if (!jobsQueue) {
    return null;
  }

  return jobsQueue.add(name, data, opts);
};
