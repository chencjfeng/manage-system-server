import { config } from './Config';
import Ioredis from 'ioredis';

export interface IRedisConfig {
  host: string; // ip
  port: number; // 端口
  username: string; // 用户名
  password: string; // 密码
}

class RedisConfig {
  private redisConfig: IRedisConfig;
  private redisClient;
  constructor() {
    this.initConfig();
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/5/29 14:38
   * @Description: 初始化链接配置
   */
  private initConfig() {
    let redisConfig = config.redisConfig;
    if (!redisConfig) {
      // redisConfig 为空时，使用默认配置
      redisConfig = {
        host: '127.0.0.1',
        port: 6379,
        username: '',
        password: '',
      };
    }

    const username = process.env.REDIS_USERNAME; // 环境变量中获取用户名
    const password = process.env.REDIS_PASSWORD; // 环境变量中获取密码
    if (username) {
      // 优先使用环境变量中的用户名和密码
      redisConfig.username = username;
    }
    if (password) {
      redisConfig.password = password;
    }

    this.redisConfig = redisConfig;
  }

  public connectRedis() {
    try {
      this.redisClient = new Ioredis(this.redisConfig);
      this.redisClient.on('connect', () => {
        console.log(
          '[connectRedis]',
          `Redis：${this.redisConfig.host}:${this.redisConfig.port}@${this.redisConfig.username}链接成功`,
        );
      });
      this.redisClient.on('error', (err) => {
        console.error('[connectRedis]', `Redis报错message：${err.message}`);
        console.error('[connectRedis]', `Redis报错stack：${err.stack}`);
      });
      this.redisClient.setex('a', 60, 'b');
      console.log(this.redisClient.get('a'));
    } catch (e) {
      console.log(e);
      console.error(
        '[connectRedis]',
        `Redis：${this.redisConfig.host}:${this.redisConfig.port}@${this.redisConfig.username}链接失败, ${e.message}`,
      );
    }
  }

  /**
   * 加锁
   * @param key
   * @param ttl
   */
  public async lock(key: string, ttl = 1) {
    key += ':lock';
    const res = await this.redisClient.set(key, 'Y', 'EX', ttl, 'NX');
    return res === 'OK';
  }

  /**
   * 释放锁
   * @param key
   */
  public unlock(key: string) {
    key += ':lock';
    this.redisClient.del(key);
  }

  /**
   * 删除单个key
   * @param key
   */
  public del(key: string) {
    this.redisClient.del(key);
  }

  /**
   * 获取单个number数据
   * @param key
   */
  public getNumber(key: string) {
    const val = this.getString(key);
    return Number(val);
  }

  /**
   * 设置单个number数据
   * @param key
   * @param value
   * @param ttl
   */
  public setNumber(key: string, value: number, ttl: number) {
    this.redisClient.setex(key, ttl, value);
  }

  public getString(key: string) {
    return this.redisClient.get(key) as string;
  }

  public setString(key: string, value: string, ttl: number) {
    this.redisClient.setex(key, ttl, value);
  }
}

const redisConfig = new RedisConfig();
export { redisConfig };
