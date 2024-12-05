/**
 * @Author: ChenJF
 * @Date: 2024/2/28 17:06
 * @Description: 接口path收归常量化，方便以后做黑白名单
 */
const API_PREFIX = '/api/v1';

class Api {
  public static readonly TEST = '/test';
  public static readonly AUTH_LOGIN = '/auth/login';
  public static readonly AUTH_LOGIN_OUT = '/auth/loginOut';
  public static readonly AUTH_CHANGE_PWD = '/auth/changePwd';

  /**
   * @Author: ChenJF
   * @Date: 2024/10/21 10:28
   * @Description: 用户管理
   */
  public static readonly USER_LIST = '/user/list';
  public static readonly USER_DETAIL = '/user/detail';
  public static readonly USER_ADD = '/user/add';
  public static readonly USER_DELETE = '/user/del';
  public static readonly USER_EDIT = '/user/edit';
  public static readonly USER_STATUS = '/user/status';
  public static readonly USER_PASSWORD = '/user/password';

  /**
   * @Author: ChenJF
   * @Date: 2024/10/21 10:28
   * @Description: 角色管理
   */
  public static readonly ROLE_PERMISSION_LIST = '/role/permissionList';
  public static readonly ROLE_LIST = '/role/list';
  public static readonly ROLE_DETAIL = '/role/detail';
  public static readonly ROLE_ADD = '/role/add';
  public static readonly ROLE_EDIT = '/role/edit';
  public static readonly ROLE_DELETE = '/role/del';

  /**
   * @Author: ChenJF
   * @Date: 2024/10/21 10:28
   * @Description: 资源设备管理
   */
  public static readonly RESOURCE_LIST = '/resource/list';
  public static readonly RESOURCE_DETAIL = '/resource/detail';
  public static readonly RESOURCE_ADD = '/resource/add';
  public static readonly RESOURCE_EDIT = '/resource/edit';
  public static readonly RESOURCE_DELETE = '/resource/del';
}

export { Api, API_PREFIX };
