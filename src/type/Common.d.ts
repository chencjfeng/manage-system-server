interface ISuccessInfo {
  isSuccess: boolean; // 是否成功
  msg?: string; // 不成功/失败的原因
}

/**
 * @Author: ChenJF
 * @Date: 2024/8/28 09:57
 * @Description: 通用批量处理response
 */
interface IBatchHandleResp {
  successIds: Array<string | number>; // 成功删除的id
  errors?: Array<{
    // 删除失败的id和原因
    id: string | number;
    msg: string;
  }>;
}

export type { ISuccessInfo, IBatchHandleResp };
