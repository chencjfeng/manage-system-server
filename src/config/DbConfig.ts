/**
 * @Author: ChenJF
 * @Date: 2024/3/1 15:35
 * @Description: 数据库配置和连接
 */

import { config } from './Config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import path from 'path';
import { createConnection } from 'typeorm';

export interface IDbBaseConfig {
  host: string; // ip
  port: number; // 端口
  username: string; // 用户名
  password: string; // 密码
  database: string; // 数据库名称
}

class DbConfig {
  private baseConfig: IDbBaseConfig;
  // 数据库连接配置
  private connectDbConfig: MysqlConnectionOptions = {
    // 号码申诉数据库
    name: 'default',
    type: 'mysql',
    host: '',
    charset: 'utf8_general_ci',
    port: 3306,
    username: '',
    password: '',
    database: 'node_server',
    synchronize: false,
    maxQueryExecutionTime: 60000,
    connectTimeout: 86400000,
    entities: [`${path.join(__dirname, '../app/entity/**/*{.js,.ts}')}`],
    extra: {
      connectionLimit: 10, // 根据需求设置合适数量的连接池限制
      queueLimit: 0, // 队列限制，满池情况下可排队的请求数
      connectTimeout: 86400000, // 连接的超时时间（毫秒）
      waitForConnections: true, // 是否等待空闲连接
    },
    logging: 'all', // 启用所有类型的日志记录，包括查询和耗时
    logger: {
      log: (level, message) => {
        console.log(level, message);
      },
      logMigration: (message) => {
        console.log(message);
      },
      logQuery: (query, parameters) => {
        console.log(
          `Query: ${query}，Parameters: ${JSON.stringify(parameters)}`,
        );
      },
      logQueryError: (error, query, parameters) => {
        console.error(`Query error: ${JSON.stringify(error)}`);
        console.log(
          `Query: ${query}，Parameters: ${JSON.stringify(parameters)}`,
        );
      },
      logQuerySlow: (time, query, parameters) => {
        console.warn(
          `Slow Query（${time} ms）: ${query}，Parameters: ${JSON.stringify(parameters)}`,
        );
      },
      logSchemaBuild: (message) => {
        console.log(message);
      },
    },
  };

  // 迁移数据库配置
  private migrationsDbConfig: MysqlConnectionOptions = {
    // 号码申诉数据库
    type: 'mysql',
    host: '',
    charset: 'utf8_general_ci',
    port: 3306,
    username: '',
    password: '',
    database: 'node_server',
    synchronize: false,
    entities: [`${path.join(__dirname, '../app/entity/**/*{.js,.ts}')}`],
    migrations: [`${path.join(__dirname, '../sql/**/*{.js,.ts}')}`],
  };

  constructor() {
    this.initDb();
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/1 17:32
   * @Description: 连接数据库
   */
  public async connectDb() {
    try {
      if (!this.connectDbConfig) {
        console.error('[connectDb]', '数据库连接配置加载失败！');
        return;
      }
      await createConnection(this.connectDbConfig);
      console.log(
        '[connectDb]',
        `${this.connectDbConfig.type} - ${this.connectDbConfig.name}链接成功`,
      );
    } catch (e) {
      console.error(
        '[connectDb]',
        `${this.connectDbConfig.type} - ${this.connectDbConfig.name}链接失败, ${e.message}`,
      );
    }
  }

  private initDb() {
    this.createConfig();
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/1 15:43
   * @Description: 初始化数据库配置信息
   */
  private createConfig() {
    const confDbConfig = config.dbConfig; // 数据库配置
    if (confDbConfig) {
      // 使用配置文件中的数据库配置
      this.baseConfig = confDbConfig;
    }

    const username = process.env.DB_USERNAME; // 环境变量中获取用户名
    const password = process.env.DB_PASSWORD; // 环境变量中获取密码
    if (username && !this.baseConfig?.username) {
      this.baseConfig.username = username;
    }
    if (password && !this.baseConfig?.password) {
      this.baseConfig.password = password;
    }

    this.connectDbConfig = { ...this.connectDbConfig, ...this.baseConfig };
    this.migrationsDbConfig = {
      ...this.migrationsDbConfig,
      ...this.baseConfig,
    };
  }

  public getMigrationConfig() {
    return this.migrationsDbConfig;
  }
}

const dbConfig = new DbConfig();
export { dbConfig };
