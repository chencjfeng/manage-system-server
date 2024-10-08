import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity } from '../../app/entity/RoleEntity';
import { UserEntity } from '../../app/entity/UserEntity';
import { BooleanEunm } from '../../enum/CommonEnum';

export class User1725506050973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 初始化用户表
    await queryRunner.query(`
        CREATE TABLE \`user\` (
           \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
           \`login_name\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录名',
           \`password\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
           \`username\` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '姓名(中文名)',
           \`status\` varchar(32) DEFAULT 'ENABLE' COMMENT '用户状态',
           \`is_default\` int(1) NOT NULL DEFAULT '0' COMMENT '是否默认用户，1是，0否',
           \`role_ids\` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '角色id',
           \`creator\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '新建人',
           \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新建时间',
           \`updater\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '更新人，最后一次更新的人',
           \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
           \`is_del\` int(1) NOT NULL DEFAULT '0' COMMENT '是否已删除，1已删除，0未删除',
           PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户信息表'
        `);
    const role = await queryRunner.manager
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.name >= :name', { name: '超级管理员' })
      .getOne();

    const adminUser = new UserEntity({
      loginName: 'admin',
      password: 'Admin_321',
      username: 'admin',
      creator: 'admin',
      updater: 'admin',
      isDefault: BooleanEunm.TRUE,
      roleIds: role?.id ? [role?.id] : [],
    });
    // 初始化admin用户
    await queryRunner.manager.insert(UserEntity, [adminUser]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
