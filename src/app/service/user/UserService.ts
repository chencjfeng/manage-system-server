import { Service } from 'typedi';
import { FindOptionsWhere, getRepository } from 'typeorm';
import { UserEntity, UserStatusEnum } from '../../entity/UserEntity';
import { IUserAddReq, IUserAddResp } from '../../req-validate/user/IUserAddReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { AesTools } from '../../../tools/AesTools';
import { CodeEnum } from '../../../enum/CodeEnum';
import { SqlTools } from '../../../tools/SqlTools';
import { BooleanEunm } from '../../../enum/CommonEnum';
import { IPwdConfirmDeleteReq } from '../../req-validate/common/IDeleteReq';
import { IUserStatusReq } from '../../req-validate/user/IUserStatusReq';
import { IBatchHandleResp } from '../../../type/Common';
import {
  IUserEditReq,
  IUserEditResp,
} from '../../req-validate/user/IUserEditReq';
import { IUserPwdReq, IUserPwdResp } from '../../req-validate/user/IUserPwdReq';

@Service()
class UserService {
  /**
   * @Author: ChenJF
   * @Date: 2024/8/26 10:28
   * @Description: 新建用户
   */
  public async addUser(
    creatorName: string,
    userInfo: IUserAddReq,
  ): Promise<CommonReturnInterface<IUserAddResp | Error>> {
    // 解密前端发来的密码
    const decryptPwd = AesTools.decryptData(
      userInfo.password,
      AesTools.BROWSER_SEC_KEY,
    );

    const insertUser: UserEntity = new UserEntity();
    insertUser.password = decryptPwd;
    insertUser.username = userInfo.username;
    insertUser.loginName = userInfo.loginName;
    insertUser.roleIds = userInfo.roleIds;
    insertUser.creator = creatorName;

    try {
      const where: FindOptionsWhere<UserEntity> = {
        loginName: userInfo.loginName,
        isDel: BooleanEunm.FALSE,
      };
      const hasUser = await getRepository(UserEntity)
        .createQueryBuilder('user')
        .where(where)
        .getOne();
      if (hasUser) {
        // 存在相同登录名，不可以创建
        return CommonTools.returnError(CodeEnum.USER_LOGIN_NAME_SAME);
      }

      const resp = await getRepository(UserEntity).insert(insertUser);
      const id = (resp?.generatedMaps?.pop() as UserEntity)?.id;
      if (SqlTools.isSuccess(resp) && id) {
        return CommonTools.returnData({
          id,
        });
      }

      console.log('[addUser]', 'sql插入用户失败', resp);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    } catch (e) {
      console.error('[addUser]', '新建用户失败', e);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/26 10:37
   * @Description: 删除用户
   */
  public async delUser(
    deleteName: string,
    delInfo: IPwdConfirmDeleteReq,
  ): Promise<CommonReturnInterface<IBatchHandleResp | Error>> {
    // 解密前端发来的密码
    const decryptPwd = AesTools.decryptData(
      delInfo.confirmPwd,
      AesTools.BROWSER_SEC_KEY,
    );
    if (!decryptPwd) {
      // 解密失败
      return CommonTools.returnError(CodeEnum.USER_PASSWORD_ERROR);
    }

    try {
      const currentInfo = await this.getUserInfoForLoginName(deleteName);
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
            void this.delSingleUser(deleteName, id)
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
      console.error('[addUser]', '删除用户失败', e);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/28 10:33
   * @Description: 状态编辑
   */
  public async statusChange(
    currentName: string,
    req: IUserStatusReq,
  ): Promise<CommonReturnInterface<Error | IBatchHandleResp>> {
    const resp: IBatchHandleResp = {
      successIds: [],
      errors: [],
    };

    const promiseArray: Array<Promise<boolean>> = [];
    req.ids.forEach((id) => {
      promiseArray.push(
        new Promise((resolve) => {
          void this.statusSingleUser(currentName, id, req.status)
            .then((singleResp) => {
              if (singleResp.code === CodeEnum.SUCCESS) {
                resp.successIds.push(id);
              } else {
                resp.errors?.push({
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
    await Promise.all(promiseArray);

    return CommonTools.returnData(resp);
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/29 15:40
   * @Description: 编辑用户信息
   */
  public async editUser(
    currentName: string,
    req: IUserEditReq,
  ): Promise<CommonReturnInterface<IUserEditResp | Error>> {
    const userInfo = await this.getUserInfoForId(req.id);
    if (!userInfo) {
      return CommonTools.returnError(CodeEnum.USER_EDIT_EMPTY_ERROR);
    }

    // 修改用户状态
    const resp = await getRepository(UserEntity)
      .createQueryBuilder()
      .update()
      .set({
        username: req.username,
        updater: currentName,
      })
      .where('id = :id', { id: req.id })
      .execute();
    if (SqlTools.isSuccess(resp)) {
      // 修改成功
      return CommonTools.returnData({ id: req.id });
    }

    console.log('[editUser]', resp);
    return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/29 15:40
   * @Description: 编辑修改用户密码
   */
  public async editUserPassword(
    currentName: string,
    req: IUserPwdReq,
  ): Promise<CommonReturnInterface<IUserPwdResp | Error>> {
    const userInfo = await this.getUserInfoForId(req.id);
    if (!userInfo) {
      return CommonTools.returnError(CodeEnum.USER_EDIT_EMPTY_ERROR);
    }

    const oldPwd = AesTools.decryptData(
      req.oldPassword,
      AesTools.BROWSER_SEC_KEY,
    );
    if (oldPwd !== userInfo.password) {
      // 旧密码有问题
      return CommonTools.returnError(CodeEnum.USER_EDIT_PASSWORD_ERROR);
    }

    const newPwd = AesTools.decryptData(
      req.newPassword,
      AesTools.BROWSER_SEC_KEY,
    );

    try {
      // 修改用户状态
      const resp = await getRepository(UserEntity)
        .createQueryBuilder()
        .update()
        .set({
          password: newPwd,
          updater: currentName,
        })
        .where('id = :id', { id: req.id })
        .execute();
      if (SqlTools.isSuccess(resp)) {
        // 修改成功
        return CommonTools.returnData({ id: req.id });
      }

      console.log('[editUserPassword]', resp);
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    } catch (e) {
      console.error('[editUserPassword]', e);
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/22 09:21
   * @Description: 根据登录名获取用户信息，未删除的用户
   */
  public async getUserInfoForLoginName(loginName: string) {
    const where: FindOptionsWhere<UserEntity> = {
      loginName,
      isDel: BooleanEunm.FALSE,
    };
    const repository = getRepository(UserEntity)
      .createQueryBuilder('user')
      .addSelect('user.password') // 默认password字段不select，这里要加上用于登录密码校验
      .where(where);
    const userInfo = await repository.getOne();
    console.log('[getUserInfoForLoginName]', loginName, userInfo);
    return userInfo;
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/29 15:37
   * @Description: 根据用户id获取用户信息
   */
  public async getUserInfoForId(id: number) {
    const where: FindOptionsWhere<UserEntity> = {
      id,
      isDel: BooleanEunm.FALSE,
    };
    const repository = getRepository(UserEntity)
      .createQueryBuilder('user')
      .addSelect('user.password') // 默认password字段不select，这里要加上用于登录密码校验
      .where(where);
    const userInfo = await repository.getOne();
    console.log('[getUserInfoForId]', id, userInfo);
    return userInfo;
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/26 10:50
   * @Description: 删除单个用户
   */
  private async delSingleUser(
    deleteName: string,
    id: number,
  ): Promise<CommonReturnInterface<Error | number>> {
    try {
      const delUserInfo = await this.getUserInfoForId(id);

      if (!delUserInfo) {
        // 需要删除的用户不存在
        return CommonTools.returnError(CodeEnum.USER_DELETE_EMPTY_ERROR);
      }
      if (delUserInfo?.isDefault) {
        // 系统默认用户，无法删除
        return CommonTools.returnError(CodeEnum.USER_DELETE_DEFAULT_ERROR);
      }

      // 删除用户
      const resp = await getRepository(UserEntity)
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

      console.log('[delSingleUser]', resp);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    } catch (e) {
      console.error('[delSingleUser]', e);
      return CommonTools.returnError(CodeEnum.DB_DELETE_ERROR);
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/8/28 15:50
   * @Description: 修改单个用户的状态
   */
  private async statusSingleUser(
    editName: string,
    id: number,
    status: UserStatusEnum,
  ): Promise<CommonReturnInterface<Error | number>> {
    try {
      const userInfo = await this.getUserInfoForId(id);
      if (!userInfo) {
        return CommonTools.returnError(CodeEnum.USER_EDIT_EMPTY_ERROR);
      }

      if (userInfo?.loginName === 'admin') {
        // 超级管理员禁止修改
        return CommonTools.returnError(CodeEnum.USER_EDIT_SUPER_ADMIN_ERROR);
      }

      // 修改用户状态
      const resp = await getRepository(UserEntity)
        .createQueryBuilder()
        .update()
        .set({
          status,
          updater: editName,
        })
        .where('id = :id', { id })
        .execute();
      if (SqlTools.isSuccess(resp)) {
        // 修改成功
        return CommonTools.returnData(id);
      }

      console.log('[statusSingleUser]', resp);
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    } catch (e) {
      console.error('statusSingleUser', e);
      return CommonTools.returnError(CodeEnum.DB_UPDATE_ERROR);
    }
  }
}

export { UserService };
