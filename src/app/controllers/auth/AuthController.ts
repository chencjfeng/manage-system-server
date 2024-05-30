import { Body, Ctx, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { ILoginReq } from '../../req-validate/auth/ILoginReq';
import { AuthService } from '../../service/auth/AuthService';
import { RouterContext } from 'koa-router';

@JsonController()
@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(Api.LOGIN_API)
  public async login(
    @Ctx() ctx: RouterContext,
    @Body({ validate: true }) body: ILoginReq,
  ) {
    return await this.authService.login(ctx, body);
  }

  @Get(Api.LOGIN_OUT_API)
  public async loginOut(@Ctx() ctx: RouterContext) {
    return await this.authService.loginOut(ctx);
  }
}

export { AuthController };
