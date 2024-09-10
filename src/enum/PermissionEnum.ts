import { PermissionEntity } from '../app/entity/PermissionEntity';

enum ModuleEnum {
  USER = 'USER', // 用户
  ROLE = 'ROLE', // 角色
}

enum ModuleStringEnum {
  USER = '用户管理', // 用户
  ROLE = '角色管理', // 角色
}

enum OperationEnum {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

enum OperationStringEnum {
  ADD = '新建',
  EDIT = '编辑',
  DELETE = '删除',
  EXPORT = '导出',
  IMPORT = '导入',
}

interface PermissionMap {
  module: ModuleEnum;
  operations: OperationEnum[];
}
const PermissionList: PermissionMap[] = [
  {
    // 用户管理
    module: ModuleEnum.USER,
    operations: [OperationEnum.ADD, OperationEnum.EDIT, OperationEnum.DELETE],
  },
  {
    // 角色管理
    module: ModuleEnum.ROLE,
    operations: [OperationEnum.ADD, OperationEnum.EDIT, OperationEnum.DELETE],
  },
];

const initPermissionTableData = (): PermissionEntity[] => {
  const list: PermissionEntity[] = [];
  PermissionList.forEach((p) => {
    const module = p.module as ModuleEnum;
    const moduleName = ModuleStringEnum[module];

    p.operations.forEach((op) => {
      list.push({
        id: `${module}_${op}`,
        module,
        moduleName,
        operation: op,
        operationName: OperationStringEnum[op],
      });
    });
  });
  return list;
};

const getAllPermissionIds = (): string[] => {
  const list: string[] = [];
  PermissionList.forEach((p) => {
    p.operations.forEach((op) => {
      list.push(`${p.module}_${op}`);
    });
  });
  return list;
};

export {
  ModuleEnum,
  ModuleStringEnum,
  OperationEnum,
  OperationStringEnum,
  PermissionList,
  initPermissionTableData,
  getAllPermissionIds,
};
