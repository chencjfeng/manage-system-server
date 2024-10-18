import { Body, Ctx, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { ILoginParams, ILoginReq } from '../../req-validate/auth/ILoginReq';
import { AuthService } from '../../service/auth/AuthService';
import { RouterContext } from 'koa-router';
import { CodeEnum } from '../../../enum/CodeEnum';

@JsonController()
@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(Api.LOGIN_API)
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

  @Get(Api.LOGIN_OUT_API)
  public async loginOut(@Ctx() ctx: RouterContext) {
    return await this.authService.loginOut(ctx);
  }
}

export { AuthController };
