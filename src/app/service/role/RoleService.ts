import { Service } from 'typedi';
import { FindOptionsWhere, getRepository } from 'typeorm';
import { RoleEntity } from '../../entity/RoleEntity';
import { BooleanEunm } from '../../../enum/CommonEnum';
import { IRoleAddReq, IRoleAddResp } from '../../req-validate/role/IRoleAddReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { CodeEnum } from '../../../enum/CodeEnum';
import { SqlTools } from '../../../tools/SqlTools';
import {
  IPermission,
  IPermissionResp,
  PermissionMap,
} from '../../../enum/PermissionEnum';
import { IDeleteReq } from '../../req-validate/common/IDeleteReq';
import { IBatchHandleResp } from '../../../type/Common';
import { IRoleEditReq } from '../../req-validate/role/IRoleEditReq';

import { IListReq, IListResp } from '../../req-validate/common/IListReq';
import {
  IRoleDetailReq,
  IRoleDetailResp,
} from '../../req-validate/role/IRoleDetailReq';

@Service()
class RoleService {
  /**
   * @Author: ChenJF
   * @Date: 2024/10/14 11:41
   * @Description: 列表查询
   */
  public async roleList(
    req: IListReq,
  ): Promise<CommonReturnInterface<IListResp<RoleEntity> | Error>> {
    try {
      const queryBuilder = SqlTools.createListRepository({
        repo: getRepository(RoleEntity),
        req,
        andWhere: [
          {
            name: 'isDel',
            values: [BooleanEunm.FALSE],
            exactMatch: true,
          },
        ],
      });
      const resp = await queryBuilder.getManyAndCount();

      const roleList = resp[0] || [];
      // 将权限id转为权限对象
      roleList.forEach((role) => {
        role.permissions = this.permissionIdsToPermissions(role.permissionIds);
      });

      return CommonTools.returnData({
        rows: resp[0] || [],
        total: resp[1] || 0,
      });
    } catch (e) {
      console.error('[roleList]', '查询角色列表数据失败', e);
      return CommonTools.returnError(CodeEnum.DB_QUERY_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/15 14:49
   * @Description: 详情查询
   */
  public async roleDetail(
    req: IRoleDetailReq,
  ): Promise<CommonReturnInterface<IRoleDetailResp | Error>> {
    try {
      const resp = await this.getRoleInfoForId(req.id);
      if (!resp) {
        console.error('[roleDetail]', '查询角色详情数据为空', req);
        return CommonTools.returnError(CodeEnum.DB_SELECT_ID_EMPTY);
      }

      return CommonTools.returnData(resp);
    } catch (e) {
      console.error('[roleDetail]', '查询角色详情数据失败', e);
      return CommonTools.returnError(CodeEnum.DB_QUERY_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 10:14
   * @Description: 新建角色
   */
  public async addRole(
    creatorName: string,
    roleInfo: IRoleAddReq,
  ): Promise<CommonReturnInterface<IRoleAddResp | Error>> {
    const insertRole = new RoleEntity({
      name: roleInfo.name,
      permissionIds: roleInfo.permissions,
      creator: creatorName,
    });
    try {
      // 过滤不存在的权限
      insertRole.permissionIds = insertRole.permissionIds.filter((id) => {
        return !!PermissionMap[id];
      });
      if (insertRole.permissionIds.length === 0) {
        // 没有权限
        return CommonTools.returnError(CodeEnum.ROLE_PERMISSION_NOT_ERROR);
      }

      const resp = await getRepository(RoleEntity).insert(insertRole);
      const id = (resp?.generatedMaps?.pop() as RoleEntity)?.id;
      if (SqlTools.isSuccess(resp) && id) {
        return CommonTools.returnData({
          id,
        });
      }

      console.log('[addRole]', 'sql插入角色失败', resp);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    } catch (err) {
      console.error('[addRole]', '新建角色失败', err);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 11:44
   * @Description: 删除角色
   */
  public async delRole(
    deleteName: string,
    delInfo: IDeleteReq,
  ): Promise<CommonReturnInterface<IBatchHandleResp | Error>> {
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
            void this.delSingleRole(deleteName, id)
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
      console.error('[delRole]', '删除角色失败', e);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 14:41
   * @Description: 编辑角色
   */
  public async editRole(editName: string, req: IRoleEditReq) {
    const role = await this.getRoleInfoForId(req.id);
    if (!role) {
      // 没有角色
      return CommonTools.returnError(CodeEnum.ROLE_EDIT_EMPTY_ERROR);
    }

    try {
      // 编辑角色
      const updateInfo = new RoleEntity({ updater: editName });
      if (req.name) {
        updateInfo.name = req.name;
      }
      if (Array.isArray(req?.permissions)) {
        const permissionIds = req.permissions.filter((id) => {
          return !!PermissionMap[id];
        });
        if (permissionIds.length === 0) {
          // 没有合适的权限
          return CommonTools.returnError(CodeEnum.ROLE_PERMISSION_NOT_ERROR);
        }
        updateInfo.permissionIds = permissionIds;
      }

      // 更新数据库
      const resp = await getRepository(RoleEntity)
        .createQueryBuilder()
        .update()
        .set(updateInfo)
        .where('id = :id', { id: req.id })
        .execute();
      if (SqlTools.isSuccess(resp)) {
        // 修改成功
        return CommonTools.returnData({ id: req.id });
      }

      console.log('[editRole]', resp);
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    } catch (e) {
      console.error('[editRole]', e);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 10:30
   * @Description: 根据roleIds获取角色列表
   */
  public async getRolesForIds(ids: number[]) {
    try {
      const where: FindOptionsWhere<RoleEntity> = {
        isDel: BooleanEunm.FALSE,
      };
      const repository = getRepository(RoleEntity)
        .createQueryBuilder('role')
        .where(where)
        .andWhere('role.id In (:...ids)', { ids });

      const roleList = await repository.getMany();
      console.log('[getRolesForIds]', ids, roleList);
      roleList.forEach((role) => {
        role.permissions = this.permissionIdsToPermissions(role.permissionIds);
      });
      return roleList;
    } catch (err) {
      console.error('[getRolesForIds]', err);
      return [];
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 11:47
   * @Description: 根据角色id获取角色信息
   */
  private async getRoleInfoForId(id: number) {
    try {
      const where: FindOptionsWhere<RoleEntity> = {
        id,
        isDel: BooleanEunm.FALSE,
      };
      const repository = getRepository(RoleEntity)
        .createQueryBuilder('role')
        .where(where);
      const roleInfo = await repository.getOne();
      if (roleInfo) {
        // 将权限id转为权限对象
        roleInfo.permissions = this.permissionIdsToPermissions(
          roleInfo.permissionIds,
        );
      }
      console.log('[getRoleInfoForId]', id, roleInfo);
      return roleInfo;
    } catch (e) {
      console.error('[getRoleInfoForId]', e);
      return null;
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/12 11:47
   * @Description: 删除单个角色
   */
  private async delSingleRole(
    deleteName: string,
    id: number,
  ): Promise<CommonReturnInterface<Error | number>> {
    try {
      const delRoleInfo = await this.getRoleInfoForId(id);

      if (!delRoleInfo) {
        // 需要删除的角色不存在
        return CommonTools.returnError(CodeEnum.ROLE_DELETE_EMPTY_ERROR);
      }
      if (delRoleInfo?.isDefault) {
        // 系统默认角色，无法删除
        return CommonTools.returnError(CodeEnum.ROLE_DELETE_DEFAULT_ERROR);
      }

      // 删除角色
      const resp = await getRepository(RoleEntity)
        .createQueryBuilder()
        .update()
        .set({
          isDel: BooleanEunm.TRUE,
          updater: deleteName,
        })
        .where('id = :id', { id })
        .execute();
      if (SqlTools.isSuccess(resp)) {
        // 删除成功
        return CommonTools.returnData(id);
      }

      console.log('[delSingleRole]', resp);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    } catch (e) {
      console.error('[delSingleRole]', e);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/17 09:51
   * @Description: 将权限id转为权限对象嵌套数组
   */
  private permissionIdsToPermissions(
    permissionIds: string[],
  ): IPermissionResp[] {
    const permissionRespMap: Record<string, IPermission[]> = {};
    permissionIds
      .map((pId) => {
        return PermissionMap[pId];
      })
      .sort((a, b) => a.index - b.index)
      .forEach((permission) => {
        if (!permissionRespMap[permission.module]) {
          permissionRespMap[permission.module] = [permission];
        } else {
          permissionRespMap[permission.module].push(permission);
        }
      });
    const permissionRespList: IPermissionResp[] = [];
    Object.values(permissionRespMap)
      .sort((a, b) => a[0].index - b[0].index)
      .forEach((permissions) => {
        permissionRespList.push({
          module: permissions[0].module,
          moduleName: permissions[0].moduleName,
          operations: permissions,
        });
      });
    return permissionRespList;
  }
}

export { RoleService };
