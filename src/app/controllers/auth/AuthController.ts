import { Body, Ctx, JsonController, Post } from 'routing-controllers';
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
}

export { AuthController };
