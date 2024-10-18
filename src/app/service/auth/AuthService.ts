import { Service } from 'typedi';
import { RouterContext } from 'koa-router';
import {
  ILoginParams,
  ILoginReq,
  ILoginResp,
} from '../../req-validate/auth/ILoginReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { AesTools } from '../../../tools/AesTools';
import { UserService } from '../user/UserService';
import { CodeEnum } from '../../../enum/CodeEnum';
import { redisConfig } from '../../../config/RedisConfig';
import { CookieKeyEnum } from '../../../enum/CookieKeyEnum';
import { CookieTools } from '../../../tools/CookieTools';
import { UserStatusEnum } from '../../entity/UserEntity';
import { LoginLogEntity } from '../../entity/LoginLogEntity';
import { getRepository } from 'typeorm';
import { SqlTools } from '../../../tools/SqlTools';
import { CtxHeaderTools } from '../../../tools/CtxHeaderTools';

@Service()
class AuthService {
  // token失效时间，3600s
  private readonly tokenInvalidTime = 60 * 60;
  constructor(private readonly userService: UserService) {}

  /**
   * @Author: ChenJF
   * @Date: 2024/5/30 16:20
   * @Description: 登录
   */
  public async login(
    ctx: RouterContext,
    body: ILoginReq,
  ): Promise<CommonReturnInterface<ILoginResp | Error>> {
    // 解密前端发来的密码
    const decryptPwd = AesTools.decryptData(
      body.password,
      AesTools.BROWSER_SEC_KEY,
    );

    const userInfo = await this.userService.getUserInfoAndRoleForLoginName(
      body.loginName,
    );
    if (!userInfo) {
      // 用户不存在
      return CommonTools.returnError(CodeEnum.LOGIN_USERNAME_ERROR);
    }
    if (userInfo.status !== UserStatusEnum.ENABLE) {
      // 用户未启用，不能登录
      return CommonTools.returnError(CodeEnum.LOGIN_USER_DISABLE_ERROR);
    }

    if (userInfo.password !== decryptPwd) {
      // 密码校验失败
      return CommonTools.returnError(CodeEnum.LOGIN_PASSWORD_VERIFY_ERROR);
    }

    // 存储token到redis和cookie中
    const token = AesTools.encryptToken(userInfo.loginName);
    const flag = await redisConfig.setString(
      token,
      userInfo.loginName,
      this.tokenInvalidTime,
    );
    if (!flag) {
      // redis保存失败，登录失败
      console.log('[login]', 'redis保存失败', userInfo.loginName);
      return CommonTools.returnError(CodeEnum.LOGIN_COMMON_ERROR);
    }
    const isSecure = ctx.request.protocol === 'https';
    ctx.cookies.set(CookieKeyEnum.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: isSecure,
    });

    // 登录成功
    return CommonTools.returnData({
      userInfo,
      token,
    });
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/5/30 16:49
   * @Description: 退出登录
   */
  public async loginOut(
    ctx: RouterContext,
  ): Promise<CommonReturnInterface<string | Error>> {
    // 删除redis和cookie中的token
    const token = CookieTools.getCookie(CookieKeyEnum.AUTH_TOKEN, ctx);
    if (token) {
      void redisConfig.del(token);
      ctx.cookies.set(CookieKeyEnum.AUTH_TOKEN, null, { maxAge: 0 });
    }
    return await Promise.resolve(CommonTools.returnData('登出成功'));
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/5/30 16:10
   * @Description: 校验token是否存在，存在则更新过期时间并返回true，不存在返回false
   */
  public async verifyTokenLoginName(token: string): Promise<string> {
    const loginName = await redisConfig.getString(token);
    if (loginName) {
      // 更新token失效时间
      void redisConfig.setString(token, loginName, this.tokenInvalidTime);
    }
    return loginName;
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/10/16 14:32
   * @Description: 登录日志存储
   */
  public async loginLog(params: ILoginParams) {
    const { ctx, loginName, loginStatus, loginMsg } = params;
    const srcIp = CtxHeaderTools.getSrcIp(ctx);
    const insertInfo = new LoginLogEntity({
      loginName,
      loginStatus,
      loginMsg,
      srcIp,
      reqBody: JSON.stringify(ctx.request.body || {}),
    });

    try {
      const resp = await getRepository(LoginLogEntity).insert(insertInfo);
      const id = (resp?.generatedMaps?.pop() as LoginLogEntity)?.id;
      if (SqlTools.isSuccess(resp) && id) {
        return CommonTools.returnData({
          id,
        });
      }

      console.log('[loginLog]', 'sql插入登录日志失败', resp);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    } catch (e) {
      console.log(e);
      console.error('[loginLog]', '插入登录日志失败', e);
      return CommonTools.returnError(CodeEnum.DB_INSERT_ERROR);
    }
  }
}

export { AuthService };
