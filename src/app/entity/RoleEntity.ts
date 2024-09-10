import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BooleanEunm } from '../../enum/CommonEnum';

@Entity('role')
class RoleEntity {
  // id
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  // 角色名
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'permission_ids', type: 'simple-array' })
  permissionIds: string[];

  // 是否默认角色，默认角色不可删除和编辑
  @Column({
    name: 'is_default',
    enum: BooleanEunm,
    type: 'enum',
    default: BooleanEunm.FALSE,
  })
  isDefault?: BooleanEunm;

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
}

export { RoleEntity };
