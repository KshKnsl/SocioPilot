import { Queue } from 'bullmq';
import redisUrl from '../config/redis.js';

export const jobsQueue = new Queue('jobs', { connection: redisUrl });

jobsQueue.on('waiting', (jobId) => {
  console.log('Job waiting', jobId);
});

console.log('BullMQ queue initialized');

export const addJob = (name, data, opts = {}) => jobsQueue.add(name, data, opts);
