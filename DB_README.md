# 数据库配置

## 一.初始化
本项目使用的是mysql数据库，所以需要运行本项目，需要先提供一个mysql数据库环境，然后配置好数据库连接信息。

### 1.数据库配置信息
数据库连接配置信息放在`/src/config/conf.json`文件中的`dbConfig`对象，如下：
```json
{
  "dbConfig": {
    "host": "数据库连接地址，例如：127.0.0.1",
    "port": 3306,
    "username": "数据库访问用户名",
    "password": "数据库密码",
    "database": "数据库名称"
  }
}
```

### 2.数据库表初始化
数据库表初始化需要运行`npm run typeorm:run`命令，该命令会根据`/src/sql/`目录下的sql初始化自动创建数据库的表和数据，如果表已经存在，则会跳过创建表操作。
```cmd
// 执行/src/sql目录下的sql文件，创建数据库表
npm run typeorm:run
```


## 二.开发者进阶使用
### 1.升级数据库连接安全等级
由于我们数据库连接配置信息放在`/src/config/conf.json`文件中明文保存，很容易造成账号密码泄露，所以建议升级数据库连接安全等级，可以在系统初始化时候将数据库用户名密码放在系统环境变量中，具体获取代码如下：
```typescript
// 具体配置在/src/config/DbConfig.ts文件

const username = process.env.DB_USERNAME; // 环境变量中获取用户名
const password = process.env.DB_PASSWORD; // 环境变量中获取密码
if (username) {
  // 使用环境变量中的用户名
  this.baseConfig.username = username;
}
if (password) {
  // 使用环境变量中的密码
  this.baseConfig.password = password;
}
```

### 2.创建新的数据库初始化文件
如果需要新增数据库初始化文件，需要新增一个sql文件，可以利用`typeorm:create`命令，该命令会在`/src/sql/`目录下创建一个新的sql初始化文件。
```cmd
// 创建一个新的User实体sql初始化文件，存放在/src/sql/v1.0.0中
npm run typeorm:create --name=v1.0.0/User
```

创建完成后，会有`up`和`down`两个方法，`up`方法用于创建数据库表和初始化表数据，`down`方法用于删除回滚数据库表和数据，具体代码如下：
```typescript
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
```

### 3.数据库回滚
我们在升级时候，执行升级sql文件后，在后续服务启动异常时候，需要回滚到之前的版本，这时候就需要用到`typeorm:revert`命令，该命令会执行`down`方法，回滚到之前的版本。
```cmd
npm run typeorm:revert
```
