/**
 * @Author: ChenJF
 * @Date: 2024/3/4 11:48
 * @Description: 用于升级包执行升级的sql配置
 */
import { dbConfig } from './DbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';

const ormCliConfig = dbConfig.getMigrationConfig();

export default new DataSource({
  ...ormCliConfig,
} as DataSourceOptions);
