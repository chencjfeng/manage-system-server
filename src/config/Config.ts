/**
 * @Author: ChenJF
 * @Date: 2024/2/28 15:36
 * @Description: 获取配置文件中的配置
 */
import configData from './conf.json';
import { IDbBaseConfig } from './DbConfig';
import { IRedisConfig } from './RedisConfig';

export enum ConfigModeEnum {
  DEV = 'dev', // 开发者调试模式
  PROD = 'prod', // 生产模式
}

export interface IConfig {
  mode: ConfigModeEnum; // 生产模式、调试模式
  uploadTmpDir: string; // 上传文件的临时目录
  logDir: string; // 日志存储目录
  port: number; // 服务监听的端口号
  dbConfig?: IDbBaseConfig; // 数据库配置
  redisConfig?: IRedisConfig; // redis配置
}

const config = configData as IConfig;

export { config };
