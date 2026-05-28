import IORedis from "ioredis";
const redisUrl = process.env.REDIS_URL;

function getRedisOptions() {
  if (redisUrl) {
    return {
      url: redisUrl,
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
  };
}

export const createRedisClient = () => {
  return new IORedis(getRedisOptions());
};

export const bullmqConnection = redisUrl
  ? { url: redisUrl }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    };

export default redisUrl;
