import { Body, Ctx, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { ILoginParams, ILoginReq } from '../../req-validate/auth/ILoginReq';
import { AuthService } from '../../service/auth/AuthService';
import { RouterContext } from 'koa-router';
import { CodeEnum } from '../../../enum/CodeEnum';
import { CurrentLoginName } from '../../../decorator/controller/CurrentLoginName';
import { IChangePwdReq } from '../../req-validate/auth/IChangePwdReq';
import { UserService } from '../../service/user/UserService';
import { CommonTools } from '../../../tools/CommonTools';

@JsonController()
@Service()
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post(Api.AUTH_LOGIN)
  public async login(
    @Ctx() ctx: RouterContext,
    @Body({ validate: true }) body: ILoginReq,
  ) {
    const resp = await this.authService.login(ctx, body);

    // 登录日志存储
    const loginParams: ILoginParams = {
      ctx,
      loginName: body.loginName,
      loginStatus: resp.code,
      loginMsg: resp.code === CodeEnum.SUCCESS ? '登录成功' : resp.msg,
    };
    void this.authService.loginLog(loginParams);
    return resp;
  }

  @Get(Api.AUTH_LOGIN_OUT)
  public async loginOut(@Ctx() ctx: RouterContext) {
    return await this.authService.loginOut(ctx);
  }

  @Post(Api.AUTH_CHANGE_PWD)
  public async changePwd(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IChangePwdReq,
  ) {
    const userInfo = await this.userService.getUserInfoForLoginName(loginName);
    if (userInfo?.id) {
      return await this.userService.editUserPassword(loginName, {
        ...body,
        id: userInfo?.id,
      });
    }
    return CommonTools.returnData({}, CodeEnum.USER_EDIT_EMPTY_ERROR);
  }
}

export { AuthController };
