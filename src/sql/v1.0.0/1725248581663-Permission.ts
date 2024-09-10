import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionEntity } from '../../app/entity/PermissionEntity';
import { initPermissionTableData } from '../../enum/PermissionEnum';

export class Permission1725248581663 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 初始化权限表
    await queryRunner.query(`
        CREATE TABLE \`permission\` (
           \`id\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '模块枚举',
           \`module\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '模块枚举',
           \`module_name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '模块名称',
           \`operation\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作权限枚举',
           \`operation_name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作权限名称',
           PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '权限信息表'
        `);
    // 初始化权限
    await queryRunner.manager.insert(
      PermissionEntity,
      initPermissionTableData(),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permission');
  }
}
