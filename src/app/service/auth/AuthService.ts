import { Service } from 'typedi';
import { RouterContext } from 'koa-router';
import { ILoginReq, ILoginResp } from '../../req-validate/auth/ILoginReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { AesTools } from '../../../tools/AesTools';
import { UserService } from '../user/UserService';
import { CodeEnum } from '../../../enum/CodeEnum';
import { redisConfig } from '../../../config/RedisConfig';
import { CookieKeyEnum } from '../../../enum/CookieKeyEnum';
import { CookieTools } from '../../../tools/CookieTools';
import { UserStatusEnum } from '../../entity/UserEntity';

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

    const userInfo = await this.userService.getUserInfoForLoginName(
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
      return CommonTools.returnError(CodeEnum.LOGIN_COMMON_ERROR);
    }
    const isSecure = ctx.request.protocol === 'https';
    ctx.cookies.set(CookieKeyEnum.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: isSecure,
    });

    // 如果需要打登录日志，则在这里处理

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
}

export { AuthService };
