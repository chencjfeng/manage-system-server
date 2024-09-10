import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity } from '../../app/entity/RoleEntity';
import { getAllPermissionIds } from '../../enum/PermissionEnum';
import { BooleanEunm } from '../../enum/CommonEnum';

export class Role1725439696501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 初始化角色表
    await queryRunner.query(`
        CREATE TABLE \`role\` (
           \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
           \`name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
           \`permission_ids\` varchar(8192) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限',
           \`is_default\` int(1) NOT NULL DEFAULT '0' COMMENT '是否默认角色，1是，0否',
           \`creator\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '新建人',
           \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新建时间',
           \`updater\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '更新人，最后一次更新的人',
           \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
           \`is_del\` int(1) NOT NULL DEFAULT '0' COMMENT '是否已删除，1已删除，0未删除',
           PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色信息表'
        `);
    // 超级管理员角色
    const superAdmin: RoleEntity = {
      name: '超级管理员',
      permissionIds: getAllPermissionIds(),
      isDefault: BooleanEunm.TRUE,
      creator: 'admin',
      updater: 'admin',
    };
    // 普通用户
    const commonUser: RoleEntity = {
      name: '普通用户',
      permissionIds: getAllPermissionIds(),
      isDefault: BooleanEunm.TRUE,
      creator: 'admin',
      updater: 'admin',
    };

    await queryRunner.manager.insert(RoleEntity, [superAdmin, commonUser]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role');
  }
}
