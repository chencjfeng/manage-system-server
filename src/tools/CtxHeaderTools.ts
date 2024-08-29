import { RouterContext } from 'koa-router';

class CtxHeaderTools {
  public static readonly REQUEST_ID = 'x-auth-request-id';
  public static readonly LOGIN_NAME = 'x-auth-login-name';

  /**
   * @Author: ChenJF
   * @Date: 2024/2/29 09:42
   * @Description: 请求来源ip
   */
  public static getSrcIp(ctx: RouterContext): string {
    const { headers } = ctx.req;

    // 代理ip
    const forIp =
      (headers['x-forwarded-for'] as string) ||
      (headers['X-Forwarded-For'] as string) ||
      '';
    if (forIp) {
      return forIp.split(',')[0];
    }

    // Koa.js 自动解析客户端 IP
    const clientIp = ctx.request.ip.replace(/^::ffff:/, '').split(',')[0];
    if (clientIp) {
      return clientIp;
    }

    return '0.0.0.0';
  }
}

export { CtxHeaderTools };
