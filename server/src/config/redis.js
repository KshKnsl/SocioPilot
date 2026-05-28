import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = Number(process.env.REDIS_PORT || 6379);

function getRedisOptions() {
  if (redisUrl) {
    return {
      url: redisUrl,
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  };
}

export const createRedisClient = () => {
  return new IORedis(getRedisOptions());
};

export const bullmqConnection = redisUrl
  ? { url: redisUrl }
  : {
      host: redisHost,
      port: redisPort,
    };

export default redisUrl;
