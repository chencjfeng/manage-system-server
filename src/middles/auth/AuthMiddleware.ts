import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { RouterContext } from 'koa-router';
import { Next } from 'koa';
import { API_PREFIX } from '../../constant/Api';
import { AuthWhitePath } from './AuthWhitePath';
import { CookieKeyEnum } from '../../enum/CookieKeyEnum';
import { AuthService } from '../../app/service/auth/AuthService';
import { HttpCode } from '../../constant/HttpCode';
import { CommonTools } from '../../tools/CommonTools';
import { CookieTools } from '../../tools/CookieTools';

/**
 * @Author: ChenJF
 * @Date: 2024/5/30 14:14
 * @Description: 校验登录token中间件
 */
@Middleware({ type: 'before' })
@Service()
export class AuthMiddleware implements KoaMiddlewareInterface {
  constructor(private readonly authService: AuthService) {}

  /**
   * @Author: ChenJF
   * @Date: 2024/5/30 15:38
   * @Description: 将白名单路径数组转换成map，节省遍历时间
   */
  private readonly whitePathMap: Record<string, boolean> = AuthWhitePath.reduce(
    (map, currentValue) => {
      map[currentValue] = true;
      return map;
    },
    {},
  );

  async use(ctx: RouterContext, next: Next): Promise<void> {
    // url接口地址，去除前缀
    const urlPath = (ctx.request.path || '').split(API_PREFIX).join('');
    if (this.isWhitePath(urlPath)) {
      // 白名单路径直接放行
      await next();
      return;
    }

    // 从 cookie 中获取 token，兼容小写（有些浏览器会自动将cookie中的key转为小写）
    const token = CookieTools.getCookie(CookieKeyEnum.AUTH_TOKEN, ctx) ?? '';
    // 校验token
    if (token && this.authService.verifyToken(token)) {
      // 校验通过，放行
      await next();
      return;
    }
    // 校验失败，返回错误信息
    this.signatureError(
      ctx,
      token ? '登录已过期' : `缺少${CookieKeyEnum.AUTH_TOKEN}认证信息`,
    );
  }

  private isWhitePath(urlPath: string): boolean {
    return this.whitePathMap[urlPath] || false;
  }

  private signatureError(ctx: RouterContext, errorMsg: string) {
    ctx.status = HttpCode.SIGNATURE_ERROR;
    ctx.body = CommonTools.returnData({}, HttpCode.SIGNATURE_ERROR, errorMsg);
  }
}
