import { Service } from 'typedi';
import { RouterContext } from 'koa-router';
import { ILoginReq, ILoginResp } from '../../req-validate/auth/ILoginReq';
import { CommonReturnInterface, CommonTools } from '../../../tools/CommonTools';
import { AesTools } from '../../../tools/AesTools';
import { UserService } from '../user/UserService';
import { CodeEnum } from '../../../enum/CodeEnum';

@Service()
class AuthService {
  constructor(private readonly userService: UserService) {}

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

    // TODO： 这里需要生成token存储到redis，并write到cookie中（同时可以做多设备登录限制，限制一个账号只能在一个设备登录）
    const token = AesTools.encryptToken(userInfo.loginName);

    return CommonTools.returnData({
      userName: userInfo.username,
      loginName: userInfo.loginName,
      token,
    });
  }
}

export { AuthService };
