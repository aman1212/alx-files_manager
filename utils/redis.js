import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.clientConnected = true;
    this.client.on('error', (error) => {
      console.log(error);
      this.clientConnected = false;
    });
  }

  isAlive() {
    return this.clientConnected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}
export const redisClient = new RedisClient();
export default redisClient;
