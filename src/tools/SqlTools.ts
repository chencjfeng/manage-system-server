import {
  DeleteResult,
  InsertResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import {
  IListReq,
  ISearch,
  OrderEnum,
} from '../app/req-validate/common/IListReq';

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

  /**
   * @Author: ChenJF
   * @Date: 2024/10/14 11:37
   * @Description: 创建list的select查询体
   */
  public static createListRepository<T>(params: {
    repo: Repository<T>;
    req: IListReq;
    andWhere?: ISearch[]; // 其他过滤条件
    orWhere?: ISearch[]; // or条件的过滤
  }) {
    const { repo, req, andWhere, orWhere } = params;
    const offset: number = (req.pageIndex ?? 1) - 1;
    const limit: number = req.pageSize ?? 20;

    let repository = repo
      .createQueryBuilder('list')
      .offset(offset * limit)
      .limit(limit);

    // where过滤查询条件
    if (Array.isArray(req?.search)) {
      repository = this.searchToWhere(req.search, repository, true);
    }

    if (Array.isArray(andWhere)) {
      repository = this.searchToWhere(andWhere, repository, true);
    }

    if (Array.isArray(orWhere)) {
      repository = this.searchToWhere(orWhere, repository, false);
    }

    // 排序
    if (req.by) {
      const order = req.order ?? OrderEnum.DESC;
      repository.orderBy(`list.${req.by}`, order);
    }

    return repository;
  }

  private static searchToWhere(
    search: ISearch[],
    repository: SelectQueryBuilder<any>,
    isAnd: boolean,
  ) {
    const operator = isAnd ? 'andWhere' : 'orWhere';
    search.forEach((item) => {
      if (item.exactMatch) {
        // 精确查询
        repository[operator](`list.${item.name} in (:${item.name})`, {
          [item.name]: item.values,
        });
      } else {
        // 模糊查询
        repository[operator](
          item.values
            .map((val) => `list.${item.name} LIKE :list${val}`)
            .join(' OR '),
          Object.fromEntries(
            item.values.map((val) => [`list${val}`, `%${val}%`]),
          ),
        );
      }
    });
    return repository;
  }
}

export { SqlTools };
