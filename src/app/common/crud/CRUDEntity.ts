import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BooleanEunm } from '../../../enum/CommonEnum';

@Entity()
abstract class CRUDEntity {
  constructor(obj?: Partial<CRUDEntity>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  // id
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

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

  // 是否已删除，1：已删除，0：未删除
  @Column({
    name: 'is_del',
    enum: BooleanEunm,
    type: 'enum',
    default: BooleanEunm.FALSE,
    select: false,
  })
  isDel?: BooleanEunm;
}

export { CRUDEntity };
