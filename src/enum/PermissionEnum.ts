interface IPermission {
  id: string; // id
  index: number; // 权重排序，数字越小，排序越靠前
  module: ModuleEnum; // 模块
  moduleName: ModuleStringEnum; // 模块名称，中文名
  operation: OperationEnum; // 操作权限
  operationName: OperationStringEnum; // 操作权限名称
}

interface IPermissionResp {
  module: ModuleEnum;
  moduleName: ModuleStringEnum;
  operations: IPermission[];
}

const initPermissionEntityList = (): IPermission[] => {
  const list: IPermission[] = [];
  let index = 0;
  PermissionList.forEach((p) => {
    const module = p.module as ModuleEnum;
    const moduleName = ModuleStringEnum[module];

    p.operations.forEach((op) => {
      index += 1;
      list.push({
        id: `${module}_${op}`,
        index,
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
  RESOURCE = 'RESOURCE', // 资源
  USER = 'USER', // 用户
  ROLE = 'ROLE', // 角色
}

enum ModuleStringEnum {
  RESOURCE = '资源管理', // 资源
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
    // 资源管理
    module: ModuleEnum.RESOURCE,
    operations: [
      OperationEnum.QUERY,
      OperationEnum.ADD,
      OperationEnum.EDIT,
      OperationEnum.DELETE,
    ],
  },
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
  type IPermission,
  type IPermissionResp,
  PermissionList,
  PermissionMap,
  getAllPermissionIds,
  getAllPermissionList,
};
