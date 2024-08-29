import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

class SqlTools {
  /**
   * @Author: ChenJF
   * @Date: 2023/9/12 10:39
   * @Description: 通用判断sql的delete/update/insert是否成功
   */
  public static isSuccess(
    result: InsertResult | UpdateResult | DeleteResult,
  ): boolean {
    if ((result as InsertResult)?.identifiers?.length > 0) {
      // insert
      return true;
    }

    if ((result as any)?.affected > 0) {
      // update、delete
      return true;
    }

    return false;
  }
}

export { SqlTools };
