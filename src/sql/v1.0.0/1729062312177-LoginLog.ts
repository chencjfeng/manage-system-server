import { MigrationInterface, QueryRunner } from 'typeorm';

export class LoginLog1729062312177 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 初始化登录日志表
    await queryRunner.query(`
        CREATE TABLE \`login_log\` (
           \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
           \`login_name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录名',
           \`src_ip\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源IP',
           \`req_body\` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '请求体',
           \`login_status\` int(4) DEFAULT 0 COMMENT '登录状态',
           \`login_msg\` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '登录信息',
           \`login_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新建时间',
           PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户登录日志表'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('login_log');
  }
}
