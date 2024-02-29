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
}

export { CommonTools };
