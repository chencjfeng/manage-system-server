/**
 * @Author: ChenJF
 * @Date: 2024/2/28 17:06
 * @Description: 接口path收归常量化，方便以后做黑白名单
 */
const API_PREFIX = '/api/v1';

class Api {
  public static readonly TEST = '/test';
  public static readonly LOGIN_API = '/login';
  public static readonly LOGIN_OUT_API = '/loginOut';

  public static readonly USER_LIST = '/user/list';
  public static readonly USER_DETAIL = '/user/detail';
  public static readonly USER_ADD = '/user/add';
  public static readonly USER_DELETE = '/user/del';
  public static readonly USER_EDIT = '/user/edit';
  public static readonly USER_STATUS = '/user/status';
  public static readonly USER_PASSWORD = '/user/password';

  public static readonly ROLE_PERMISSION_LIST = '/role/permissionList';
  public static readonly ROLE_LIST = '/role/list';
  public static readonly ROLE_DETAIL = '/role/detail';
  public static readonly ROLE_ADD = '/role/add';
  public static readonly ROLE_EDIT = '/role/edit';
  public static readonly ROLE_DELETE = '/role/del';
}

export { Api, API_PREFIX };
