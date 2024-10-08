import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AesTools } from '../../tools/AesTools';
import { BooleanEunm } from '../../enum/CommonEnum';
import { RoleEntity } from './RoleEntity';
import { NumberArrayTransformer } from '../../tools/NumberArrayTransformer';

enum UserStatusEnum {
  ENABLE = 'ENABLE', // 启用
  DISABLED = 'DISABLED', // 禁用
}

/**
 * @Author: ChenJF
 * @Date: 2024/3/1 16:22
 * @Description: 用户表
 */
@Entity('user')
class UserEntity {
  constructor(user?: Partial<UserEntity>) {
    if (user) {
      Object.assign(this, user);
    }
  }

  // id
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  // 登录名
  @Column({ name: 'login_name' })
  loginName: string;

  // 密码，select时候默认不返回
  @Column({ name: 'password', select: false })
  password?: string;

  // 是否默认用户，默认用户不可删除，只能修改密码
  @Column({
    name: 'is_default',
    enum: BooleanEunm,
    type: 'enum',
    default: BooleanEunm.FALSE,
  })
  isDefault?: BooleanEunm;

  // 姓名(中文名)
  @Column({ name: 'username' })
  username: string;

  // 用户状态
  @Column({
    name: 'status',
    enum: UserStatusEnum,
    type: 'enum',
    default: UserStatusEnum.ENABLE,
  })
  status?: UserStatusEnum;

  // 用户的角色id，多个用逗号分割
  @Column({
    name: 'role_ids',
    type: 'simple-array',
    transformer: new NumberArrayTransformer(),
  })
  roleIds?: number[];

  // 创建人
  @Column({ name: 'creator', default: 'admin' })
  creator?: string;

  // 创建时间
  @CreateDateColumn({ name: 'create_time', update: false })
  createTime?: string;

  // 更新人
  @Column({ name: 'updater', default: 'admin' })
  updater?: string;

  // 更新时间
  @CreateDateColumn({ name: 'update_time', update: true })
  updateTime?: string;

  // 是否默认用户，默认用户不可删除，只能修改密码
  @Column({
    name: 'is_del',
    enum: BooleanEunm,
    type: 'enum',
    default: BooleanEunm.FALSE,
    select: false,
  })
  isDel?: BooleanEunm;

  roles?: RoleEntity[];

  /**
   * @Author: ChenJF
   * @Date: 2024/3/4 15:43
   * @Description: insert和update的时候，对特定字段数据先加密
   */
  @BeforeInsert()
  @BeforeUpdate()
  private encryptFields() {
    if (this.password) {
      this.password = AesTools.encryptData(
        this.password,
        AesTools.PASSWORD_SEC_KEY,
      );
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/4 15:43
   * @Description: select时候对特定字段先解密
   */
  @AfterLoad()
  private decryptFields() {
    if (this.password) {
      this.password = AesTools.decryptData(
        this.password,
        AesTools.PASSWORD_SEC_KEY,
      );
    }
  }
}

export { UserEntity, UserStatusEnum };
