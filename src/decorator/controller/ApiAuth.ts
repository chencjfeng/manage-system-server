// 自定义授权装饰器
import { Action, Authorized } from 'routing-controllers';
import { ModuleEnum, OperationEnum } from '../../enum/PermissionEnum';
import { CtxHeaderTools } from '../../tools/CtxHeaderTools';
import { UserService } from '../../app/service/user/UserService';
import { Container } from 'typedi';

async function authorizationChecker(
  action: Action,
  roles: string[],
): Promise<boolean> {
  const loginName = action.request.header[CtxHeaderTools.LOGIN_NAME];
  if (!loginName) {
    return false;
  }

  // 获取用户角色权限，判断是否有权限
  const userService: UserService = Container.get(UserService);
  const userInfo = await userService.getUserInfoAndRoleForLoginName(loginName);
  const roleName = roles.join('_');
  if (userInfo?.roles?.find((role) => role.permissionIds.includes(roleName))) {
    // 有权限
    return true;
  }

  return false;
}

/**
 * @Author: ChenJF
 * @Date: 2024/9/10 09:20
 * @Description: 校验api权限
 */
function ApiAuth(module: ModuleEnum, operation: OperationEnum) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // 调用原有的 @Authorized 装饰器
    Authorized(`${module}_${operation}`)(target, propertyKey, descriptor);
  };
}

export { authorizationChecker, ApiAuth };
