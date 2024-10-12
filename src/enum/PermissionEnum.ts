interface IPermission {
  id: string; // id
  module: ModuleEnum; // 模块
  moduleName: string; // 模块名称，中文名
  operation: OperationEnum; // 操作权限
  operationName: string; // 操作权限名称
}

interface IPermissionResp {
  module: ModuleEnum;
  moduleName: ModuleStringEnum;
  operations: IPermission[];
}

const initPermissionEntityList = (): IPermission[] => {
  const list: IPermission[] = [];
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

enum ModuleEnum {
  USER = 'USER', // 用户
  ROLE = 'ROLE', // 角色
}

enum ModuleStringEnum {
  USER = '用户管理', // 用户
  ROLE = '角色管理', // 角色
}

enum OperationEnum {
  QUERY = 'QUERY',
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

enum OperationStringEnum {
  QUERY = '查看',
  ADD = '新建',
  EDIT = '编辑',
  DELETE = '删除',
  EXPORT = '导出',
  IMPORT = '导入',
}

interface IPermissionMap {
  module: ModuleEnum;
  operations: OperationEnum[];
}
const PermissionList: IPermissionMap[] = [
  {
    // 用户管理
    module: ModuleEnum.USER,
    operations: [
      OperationEnum.QUERY,
      OperationEnum.ADD,
      OperationEnum.EDIT,
      OperationEnum.DELETE,
    ],
  },
  {
    // 角色管理
    module: ModuleEnum.ROLE,
    operations: [
      OperationEnum.QUERY,
      OperationEnum.ADD,
      OperationEnum.EDIT,
      OperationEnum.DELETE,
    ],
  },
];

const PermissionMap: Record<string, IPermission> =
  initPermissionEntityList().reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc; // 返回累加器
  }, {});

const getAllPermissionIds = (): string[] => {
  const list: string[] = [];
  PermissionList.forEach((p) => {
    p.operations.forEach((op) => {
      list.push(`${p.module}_${op}`);
    });
  });
  return list;
};

const getAllPermissionList = (): IPermissionResp[] => {
  const list: IPermissionResp[] = [];
  PermissionList.forEach((p) => {
    const module = p.module as ModuleEnum;
    const moduleName = ModuleStringEnum[module];

    const m: IPermissionResp = {
      module,
      moduleName,
      operations: [],
    };
    p.operations.forEach((op) => {
      const id = `${module}_${op}`;
      m.operations.push(PermissionMap[id]);
    });
    list.push(m);
  });

  return list;
};

export {
  ModuleEnum,
  ModuleStringEnum,
  OperationEnum,
  OperationStringEnum,
  PermissionList,
  PermissionMap,
  getAllPermissionIds,
  type IPermission,
  type IPermissionResp,
  getAllPermissionList,
};
