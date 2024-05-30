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

@Service()
class AuthService {
  // token失效时间，600s
  private readonly tokenInvalidTime = 600;
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
    if (!decryptPwd) {
      // 登录密码不符合加密规则
      return CommonTools.returnError(CodeEnum.LOGIN_PASSWORD_ERROR);
    }

    const userInfo = await this.userService.getUserInfoForLoginName(
      body.loginName,
    );
    if (!userInfo) {
      // 用户不存在
      return CommonTools.returnError(CodeEnum.LOGIN_USERNAME_ERROR);
    }

    if (userInfo.password !== decryptPwd) {
      // 密码校验失败
      return CommonTools.returnError(CodeEnum.LOGIN_PASSWORD_VERIFY_ERROR);
    }

    // 存储token到redis和cookie中
    const token = AesTools.encryptToken(userInfo.loginName);
    redisConfig.setString(token, userInfo.loginName, this.tokenInvalidTime);
    ctx.cookies.set(CookieKeyEnum.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: true,
    });

    // 如果需要打登录日志，则在这里处理

    return CommonTools.returnData({
      userName: userInfo.username,
      loginName: userInfo.loginName,
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
      redisConfig.del(token);
      ctx.cookies.set(CookieKeyEnum.AUTH_TOKEN, '', {
        httpOnly: true,
        secure: true,
      });
    }
    return await Promise.resolve(CommonTools.returnData('登出成功'));
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/5/30 16:10
   * @Description: 校验token是否存在，存在则更新过期时间并返回true，不存在返回false
   */
  public verifyToken(token: string): boolean {
    const username = redisConfig.getString(token);
    if (username) {
      // 更新token失效时间
      redisConfig.setString(token, username, this.tokenInvalidTime);
    }
    return !!username;
  }
}

export { AuthService };
