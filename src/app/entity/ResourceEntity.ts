import { AfterLoad, Column, Entity } from 'typeorm';
import { CRUDEntity } from '../common/crud/CRUDEntity';
import {
  ResourceTypeEnum,
  resourceTypeEnumToString,
} from '../../enum/ResourceEnum';

@Entity('resource')
class ResourceEntity extends CRUDEntity {
  // 名称
  @Column({ name: 'name' })
  name: string;

  // 备注描述
  @Column({ name: 'description' })
  description?: string;

  // 设备号（唯一）
  @Column({ name: 'device_num' })
  deviceNum?: string;

  // 设备类型
  @Column({
    name: 'type',
    enum: ResourceTypeEnum,
    type: 'enum',
    default: ResourceTypeEnum.UNKNOWN_TYPE,
  })
  type: ResourceTypeEnum;

  typeName?: string;

  @AfterLoad()
  private selectFields() {
    this.typeName = resourceTypeEnumToString(this.type);
  }
}

export { ResourceEntity };
