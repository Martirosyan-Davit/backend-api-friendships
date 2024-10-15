import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  saveSessionToken(userId: Uuid, sessionToken: string): Promise<string | null> {
    return this.redisClient.set(`user:${userId}`, sessionToken);
  }

  getSessionToken(userId: Uuid): Promise<string | null> {
    return this.redisClient.get(`user:${userId}`);
  }

  removeSessionToken(userId: Uuid): Promise<number> {
    return this.redisClient.del(`user:${userId}`);
  }

  async checkSessionToken(userId: Uuid, token: string): Promise<boolean> {
    const result = await this.redisClient.get(`user:${userId}`);

    return result === token;
  }

  savePin(email: string, sessionToken: string) {
    return this.redisClient.set(`email: ${email}`, sessionToken);
  }

  getPin(email: string): Promise<string | null> {
    return this.redisClient.get(`email: ${email}`);
  }

  removePin(email: string): Promise<number> {
    return this.redisClient.del(`email: ${email}`);
  }

  async checkPin(email: string, pin: string): Promise<boolean> {
    const result = await this.redisClient.get(`email: ${email}`);

    return result === pin;
  }
}
