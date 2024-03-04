import { CodeEnum, codeEnumToString } from '../enum/CodeEnum';

export interface CommonReturnInterface<K> {
  data: K;
  code: CodeEnum;
  msg: string;
}

class CommonTools {
  public static returnData<K>(
    data: K,
    code: number = CodeEnum.SUCCESS,
    msg = '',
  ): CommonReturnInterface<K> {
    if (code !== CodeEnum.SUCCESS && !msg) {
      // 找枚举值对应的错误信息
      msg = codeEnumToString(code);
    }
    return {
      data,
      code,
      msg,
    };
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/4 15:05
   * @Description: 错误信息返回
   */
  public static returnError(
    code: CodeEnum,
    msg = '',
  ): CommonReturnInterface<Error> {
    if (!msg) {
      // 找枚举值对应的错误信息
      msg = codeEnumToString(code);
    }

    return { data: new Error(msg), code, msg };
  }
}

export { CommonTools };
