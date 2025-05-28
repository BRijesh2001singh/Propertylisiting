import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_CLIENT,
});

redisClient.on('error', (err) => console.error('Redis error:', err));

redisClient.connect();

export default redisClient;
