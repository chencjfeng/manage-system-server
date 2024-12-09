/**
 * @Author: ChenJF
 * @Date: 2024/3/1 15:35
 * @Description: 日志log配置文件
 */
import log4 from 'koa-log4';
import { NodeEnvTools } from '../tools/NodeEnvTools';
import path from 'path';
import { Configuration } from 'log4js';
import { config, ConfigModeEnum } from './Config';
import fs from 'fs';

// 获取文件名和行号的函数
const getCallerInfo = () => {
  const err = new Error();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const stack = err.stack.split('\n');
  const callerLine = stack[3]; // 第三行通常是调用 log 方法的行
  const match = callerLine.match(/\((.*):(\d+):\d+\)/);
  const fileName = match ? match[1] : 'unknown file';
  const lineNumber = match ? match[2] : 'unknown line';
  return `[${fileName}:${lineNumber}]`;
};

const tmp = JSON.stringify;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
JSON.stringify = function (
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number,
) {
  replacer = replacer ?? LogConfig.handleCircular();
  return tmp(value, replacer, space);
};

/**
 * @Author: ChenJF
 * @Date: 2024/2/28 17:21
 * @Description: 日志存储目录
 */
const mainPath = NodeEnvTools.isDev()
  ? path.join(__dirname, '../../log-tmp')
  : config.logDir;

class LogConfig {
  public static readonly logConfig: Configuration = {
    appenders: {
      // 系统日志
      access: {
        type: 'dateFile',
        pattern: '_yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout: {
          type: 'pattern',
          pattern:
            '{"date":"%d{yyyy-MM-dd hh:mm:ss.SSS}","level":"%p","category":"%c","host":"%h","pid":"%z","data":"%m"}',
        },
        encoding: 'utf-8',
        category: 'access',
        filename: path.join(mainPath, '/access/access'),
      },
      // 应用日志
      application: {
        type: 'dateFile',
        pattern: '_yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout: {
          type: 'pattern',
          pattern:
            '{"date":"%d{yyyy-MM-dd hh:mm:ss.SSS}","level":"%p","category":"%c","host":"%h","pid":"%z","data":"%m"}',
        },
        encoding: 'utf-8',
        category: 'application',
        filename: path.join(mainPath, '/application/application'),
      },
      out: {
        type: 'console',
      },
    },
    categories: {
      default: { appenders: ['out'], level: 'info' },
      access: { appenders: ['access'], level: 'info' },
      application: { appenders: ['application'], level: 'info' },
    },
  };

  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 16:08
   * @Description: 初始化代码中日志打印，hooks console
   */
  public static initCodeLog(): void {
    if (!fs.existsSync(mainPath)) {
      try {
        // 目录不存在，创建目录
        fs.mkdirSync(mainPath);
      } catch (e) {
        console.error('initCodeLog', `目录${mainPath}创建失败`, e);
      }
    }

    log4.configure(this.logConfig);

    const consoleLogger = log4.getLogger('application');
    const hookConsole = (method: string) => {
      console[method] = (...arg: any) => {
        const prefix = getCallerInfo();
        consoleLogger[method === 'log' ? 'info' : method](prefix, ...arg);
      };
    };

    if (!NodeEnvTools.isDev()) {
      // 非本地开发时
      // hooks控制台输出
      if (config.mode === ConfigModeEnum.DEV) {
        // 调试模式，打印所有日志
        hookConsole('trace');
        hookConsole('debug');
        hookConsole('log');
        hookConsole('info');
        hookConsole('warn');
      }
      hookConsole('error');
    }
  }

  /**
   * 访问级别的日志
   */
  public static accessLog(message) {
    const log = log4.getLogger('access');
    log.info(message);
  }

  /**
   * @Author: ChenJF
   * @Date: 2023/3/9 09:50
   * @Description: 解决JSON.stringify 循环引用的bug
   */
  public static handleCircular() {
    const cache: any[] = [];
    const keyCache: string[] = [];
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        const index: number = cache.indexOf(value);
        if (index !== -1) {
          return `[Circular ${keyCache[index]}]`;
        }
        cache.push(value);
        keyCache.push(key || 'root');
      }
      return value as string;
    };
  }
}

export { LogConfig };
