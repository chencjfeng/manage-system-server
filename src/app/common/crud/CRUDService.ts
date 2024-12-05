import {
  IListReq,
  IListResp,
  ISearch,
  OrderEnum,
} from '../../req-validate/common/IListReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { SqlTools } from '../../../tools/SqlTools';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BooleanEunm } from '../../../enum/CommonEnum';
import { CodeEnum } from '../../../enum/CodeEnum';
import { IDetailReq } from '../../req-validate/common/IDetailReq';
import { CRUDEntity } from './CRUDEntity';
import {
  IDeleteReq,
  IPwdConfirmDeleteReq,
} from '../../req-validate/common/IDeleteReq';
import { IBatchHandleResp } from '../../../type/Common';
import { AesTools } from '../../../tools/AesTools';
import { UserService } from '../../service/user/UserService';
import { IAddReq, IAddResp } from '../../req-validate/common/IAddReq';
import { IEditReq, IEditResp } from '../../req-validate/common/IEditReq';

/**
 * @Author: ChenJF
 * @Date: 2024/12/2 15:57
 * @Description: CURD增删改查基本接口
 */
abstract class CRUDService<E extends CRUDEntity> {
  constructor(private readonly userService: UserService) {}
  /**
   * @Author: ChenJF
   * @Date: 2024/12/2 16:14
   * @Description: 获取typeorm的Repository
   * 用function获取repo，主要避免repo在不同function中的竞争排队
   */
  abstract getRepo(): Repository<E>;
  /**
   * @Author: ChenJF
   * @Date: 2024/12/2 16:34
   * @Description: 是否有删除标识列
   */
  abstract get isDelColumn(): boolean;

  /**
   * @Author: ChenJF
   * @Date: 2024/12/3 10:54
   * @Description: 新建数据
   */
  public async add<A extends IAddReq>(
    creatorName: string,
    req: A,
  ): Promise<CommonReturnInterface<IAddResp | Error>> {
    const repo = this.getRepo();
    try {
      // 创建人
      req.creator = creatorName;
      const resp = await repo.insert(req as any);
      const id = (resp?.generatedMaps?.pop() as CRUDEntity)?.id;
      if (SqlTools.isSuccess(resp) && id) {
        return CommonTools.returnData({
          id,
        });
      }

      console.log(
        `[${repo.metadata.name}.add(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        'sql插入数据失败',
        resp,
      );
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.add(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '新建数据失败',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/3 10:10
   * @Description: 普通删除数据，兼容批量删除
   */
  public async delete<D extends IDeleteReq>(
    deleteUser: string,
    delInfo: D,
  ): Promise<CommonReturnInterface<IBatchHandleResp | Error>> {
    const repo = this.getRepo();
    try {
      const deleteResp: IBatchHandleResp = {
        successIds: [],
        errors: [],
      };
      // 遍历删除，适合单个多个删除
      const delPromiseArray: Array<Promise<boolean>> = [];
      delInfo.ids.forEach((id) => {
        delPromiseArray.push(
          new Promise((resolve) => {
            void this.delSingle(deleteUser, id)
              .then((singleResp) => {
                if (singleResp.code === CodeEnum.SUCCESS) {
                  deleteResp.successIds.push(id);
                } else {
                  deleteResp.errors?.push({
                    id,
                    msg: singleResp.msg,
                  });
                }
              })
              .finally(() => {
                resolve(true);
              });
          }),
        );
      });
      await Promise.all(delPromiseArray);

      return CommonTools.returnData(deleteResp);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.delete(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '删除数据',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/3 10:16
   * @Description: 二次确认删除,用于重要数据删除校验
   */
  public async confirmDelete<D extends IPwdConfirmDeleteReq>(
    deleteUser: string,
    delInfo: D,
  ): Promise<CommonReturnInterface<IBatchHandleResp | Error>> {
    // 解密前端发来的密码
    const decryptPwd = AesTools.decryptData(
      delInfo.confirmPwd,
      AesTools.BROWSER_SEC_KEY,
    );
    const repo = this.getRepo();
    try {
      const currentInfo =
        await this.userService.getUserInfoForLoginName(deleteUser);
      if (currentInfo?.password !== decryptPwd) {
        // 判断确认密码是否一致
        return CommonTools.returnError(CodeEnum.USER_LOGIN_PASSWORD_ERROR);
      }

      const deleteResp: IBatchHandleResp = {
        successIds: [],
        errors: [],
      };
      // 遍历删除，适合单个多个删除
      const delPromiseArray: Array<Promise<boolean>> = [];
      delInfo.ids.forEach((id) => {
        delPromiseArray.push(
          new Promise((resolve) => {
            void this.delSingle(deleteUser, id)
              .then((singleResp) => {
                if (singleResp.code === CodeEnum.SUCCESS) {
                  deleteResp.successIds.push(id);
                } else {
                  deleteResp.errors?.push({
                    id,
                    msg: singleResp.msg,
                  });
                }
              })
              .finally(() => {
                resolve(true);
              });
          }),
        );
      });
      await Promise.all(delPromiseArray);

      return CommonTools.returnData(deleteResp);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.confirmDelete(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '删除数据',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/3 11:51
   * @Description: 更新编辑数据
   */
  public async edit<D extends IEditReq>(
    editUser: string,
    editInfo: D,
  ): Promise<CommonReturnInterface<IEditResp | Error>> {
    const detailInfo = await this.getDetail({ id: editInfo.id });
    if (detailInfo.code !== CodeEnum.SUCCESS) {
      // 需要编辑的数据不存在
      return CommonTools.returnError(CodeEnum.DB_SELECT_ID_EMPTY);
    }

    const repo = this.getRepo();
    try {
      // 修改数据
      const setEditData = {
        updater: editUser,
      };
      Object.keys(editInfo).forEach((key) => {
        if (key !== 'id') {
          setEditData[key] = editInfo[key];
        }
      });
      const resp = await repo
        .createQueryBuilder()
        .update()
        .set(setEditData as any)
        .where('id = :id', { id: editInfo.id })
        .execute();
      if (SqlTools.isSuccess(resp)) {
        // 修改成功
        return CommonTools.returnData({ id: editInfo.id });
      }

      console.log(
        `[${repo.metadata.name}.edit(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        resp,
      );
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.edit(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '编辑数据失败',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/2 16:10
   * @Description: 获取列表数据
   */
  public async getList<L extends IListReq>(
    req: L,
  ): Promise<CommonReturnInterface<IListResp<E> | Error>> {
    const repo = this.getRepo();
    try {
      const delWhere: ISearch[] = [];
      if (this.isDelColumn) {
        // 有删除列，查询要带上删除标识列
        delWhere.push({
          name: 'isDel',
          values: [BooleanEunm.FALSE],
          exactMatch: true,
        });
      }
      if (!req.by) {
        // 没有排序则默认用id倒序
        req.by = 'id';
        req.order = OrderEnum.DESC;
      }
      const queryBuilder = SqlTools.createListRepository({
        repo,
        req,
        andWhere: delWhere,
      });
      const resp = await queryBuilder.getManyAndCount();

      const list = resp[0] || [];

      return CommonTools.returnData({
        rows: list,
        total: resp[1] || 0,
      });
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.getList(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '查询列表数据失败',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_QUERY_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/2 16:50
   * @Description: 获取详情数据
   */
  public async getDetail<D extends IDetailReq>(
    req: D,
  ): Promise<CommonReturnInterface<E | Error>> {
    const repo = this.getRepo();
    try {
      const { id } = req;
      const where: FindOptionsWhere<any> = {};
      if (id) {
        where.id = id;
      }
      if (this.isDelColumn) {
        where.isDel = BooleanEunm.FALSE;
      }

      const repository = repo.createQueryBuilder('crud').where(where);
      const detailInfo = await repository.getOne();
      console.log(
        `[${repo.metadata.name}.getDetail(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        id,
        detailInfo,
      );

      if (!detailInfo) {
        return CommonTools.returnError(CodeEnum.DB_SELECT_ID_EMPTY);
      }
      return CommonTools.returnData(detailInfo);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.getDetail(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        '查询详情数据失败',
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_QUERY_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/12/3 09:53
   * @Description: 删除单个
   */
  private async delSingle(
    deleteName: string,
    id: number,
  ): Promise<CommonReturnInterface<Error | number>> {
    const repo = this.getRepo();
    try {
      const delInfo = await this.getDetail({ id });

      if (delInfo.code !== CodeEnum.SUCCESS) {
        // 需要删除的数据不存在
        return CommonTools.returnError(CodeEnum.DB_SELECT_ID_EMPTY);
      }

      // 删除数据
      let resp;
      if (this.isDelColumn) {
        // 有删除标识列，假删除
        resp = await repo
          .createQueryBuilder()
          .update()
          .set({
            isDel: BooleanEunm.TRUE,
            updater: deleteName,
          } as any)
          .where('id = :id', { id })
          .execute();
        if (SqlTools.isSuccess(resp)) {
          // 删除成功
          return CommonTools.returnData(id);
        }
      } else {
        // 没有删除标识，直接删除
        resp = await repo
          .createQueryBuilder()
          .delete()
          .where('id = :id', { id })
          .execute();
        if (SqlTools.isSuccess(resp)) {
          // 删除成功
          return CommonTools.returnData(id);
        }
      }

      console.log(
        `[${repo.metadata.name}.delSingle(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        resp,
      );
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    } catch (e) {
      console.error(
        `[${repo.metadata.name}.delSingle(${repo.metadata.database ?? '-'}.${repo.metadata.tableName})]`,
        e,
      );
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }
}

export { CRUDService };
