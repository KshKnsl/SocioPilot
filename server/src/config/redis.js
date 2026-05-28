import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT || 6379);
const hasRedisConfig = Boolean(redisUrl || redisHost);

function getRedisOptions() {
  if (redisUrl) {
    return {
      url: redisUrl,
      maxRetriesPerRequest: null,
    };
  }

  if (!hasRedisConfig) {
    return null;
  }

  return {
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  };
}

export const createRedisClient = () => {
  const options = getRedisOptions();
  if (!options) {
    return null;
  }
  return new IORedis(options);
};

export const bullmqConnection = redisUrl
  ? { url: redisUrl }
  : hasRedisConfig
    ? {
        host: redisHost,
        port: redisPort,
      }
    : null;

export default redisUrl;
