import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ModuleEnum, OperationEnum } from '../../enum/PermissionEnum';

@Entity('permission')
class PermissionEntity {
  // id
  @PrimaryColumn({ name: 'id' })
  id: string;

  // 模块
  @Column({ name: 'module', enum: ModuleEnum, type: 'enum' })
  module: ModuleEnum;

  // 模块名称，中文名
  @Column({ name: 'module_name' })
  moduleName: string;

  // 操作权限
  @Column({ name: 'operation', enum: OperationEnum, type: 'enum' })
  operation: OperationEnum;

  // 操作权限名称
  @Column({ name: 'operation_name' })
  operationName: string;
}

export { PermissionEntity };
