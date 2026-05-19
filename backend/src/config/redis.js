const Redis = require("ioredis");
const { ENV } = require("./env");

const redis = new Redis({
  host: ENV.REDIS_HOST || "localhost",
  port: ENV.REDIS_PORT || 6379,
  password: ENV.REDIS_PASSWORD ? ENV.REDIS_PASSWORD : undefined,
  lazyConnect: true,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttlSeconds = 300) => {
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
};

const delCache = async (key) => {
  await redis.del(key);
};

const delByPattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(...keys);
};

module.exports = { redis, getCache, setCache, delCache, delByPattern };