const Redis = require("ioredis");
const { ENV } = require("./env");

let redisAvailable = false;

const redis = new Redis({
  host: ENV.REDIS_HOST || "localhost",
  port: ENV.REDIS_PORT || 6379,
  password: ENV.REDIS_PASSWORD ? ENV.REDIS_PASSWORD : undefined,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
});

redis.on("connect", () => {
  redisAvailable = true;
  console.log("Redis connected");
});

redis.on("error", (err) => {
  redisAvailable = false;
  console.error("Redis error:", err.message);
});

const connectRedis = async () => {
  try {
    await redis.connect();
    redisAvailable = true;
  } catch (err) {
    redisAvailable = false;
    console.warn("Redis unavailable — running without cache:", err.message);
  }
};

const getCache = async (key) => {
  if (!redisAvailable) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisAvailable) return;
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

const delCache = async (key) => {
  if (!redisAvailable) return;
  try {
    await redis.del(key);
  } catch {
    /* ignore */
  }
};

const delByPattern = async (pattern) => {
  if (!redisAvailable) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch {
    /* ignore */
  }
};

module.exports = { redis, connectRedis, getCache, setCache, delCache, delByPattern };
