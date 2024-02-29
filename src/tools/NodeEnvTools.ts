/**
 * @Author: ChenJF
 * @Date: 2024/2/28 15:06
 * @Description: Node环境变量类型
 */
export enum NodeEnvEnum {
  PROD = 'prod', // 发布环境
  TEST = 'test', // 测试环境
  DEV = 'dev', // 本地开发环境
}

/**
 * @Author: ChenJF
 * @Date: 2024/2/28 15:06
 * @Description: Node环境变量工具
 */
class NodeEnvTools {
  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 15:07
   * @Description: 判断是否是dev环境
   */
  public static isDev(): boolean {
    return process.env.NODE_ENV === NodeEnvEnum.DEV;
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 15:07
   * @Description: 判断是否是prod环境
   */
  public static isProd(): boolean {
    return process.env.NODE_ENV === NodeEnvEnum.PROD;
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 15:07
   * @Description: 判断是否是test环境
   */
  public static isTest(): boolean {
    return process.env.NODE_ENV === NodeEnvEnum.TEST;
  }
}

export { NodeEnvTools };
