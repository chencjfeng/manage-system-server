/**
 * @Author: ChenJF
 * @Date: 2024/2/28 15:36
 * @Description: 获取配置文件中的配置
 */
import configData from './conf.json';

export enum ConfigModeEnum {
  DEV = 'dev', // 开发者调试模式
  PROD = 'prod', // 生产模式
}

export interface IConfig {
  mode: ConfigModeEnum; // 生产模式、调试模式
  uploadTmpDir: string; // 上传文件的临时目录
  logDir: string; // 日志存储目录
  port: number; // 服务监听的端口号
}

const config = configData as IConfig;

export { config };
