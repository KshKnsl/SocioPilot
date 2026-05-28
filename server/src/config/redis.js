import IORedis from "ioredis";
const redisUrl = process.env.REDIS_URL;
export const createRedisClient = () => {
  return new IORedis(redisUrl);
};

export default redisUrl;
