import IORedis from "ioredis";

const redisHost = 'redis';
const redisPort = 6379;
const redisUrl = `redis://${redisHost}:${redisPort}`;

function getRedisOptions() {
  return {
    url: redisUrl,
    maxRetriesPerRequest: null,
  };
}

export const createRedisClient = () => {
  return new IORedis(getRedisOptions());
};

export const bullmqConnection = { url: redisUrl };

export default redisUrl;
