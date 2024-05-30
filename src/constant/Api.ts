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
}

export { Api, API_PREFIX };
