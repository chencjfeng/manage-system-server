import { MigrationInterface, QueryRunner } from 'typeorm';

export class Resource1733216598657 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`resource\` (
           \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
           \`name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '设备名称',
           \`description\` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '备注描述',
           \`device_num\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '设备编号',
           \`type\` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'UNKNOWN_TYPE' COMMENT '设备类型',
           \`creator\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '新建人',
           \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新建时间',
           \`updater\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '更新人，最后一次更新的人',
           \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
           \`is_del\` int(1) NOT NULL DEFAULT '0' COMMENT '是否已删除，1已删除，0未删除',
           PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '资源设备信息表'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('resource');
  }
}
