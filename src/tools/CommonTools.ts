import { CodeEnum } from '../enum/CodeEnum';

export interface CommonReturnInterface<K> {
  data: K;
  code: CodeEnum;
  msg: string;
}

class CommonTools {
  public static returnData<K>(
    data: K,
    code = CodeEnum.SUCCESS,
    msg = '',
  ): CommonReturnInterface<K> {
    return {
      data,
      code,
      msg,
    };
  }
}

export { CommonTools };
