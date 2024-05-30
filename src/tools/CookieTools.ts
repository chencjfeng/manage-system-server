import { RouterContext } from 'koa-router';

export class CookieTools {
  public static getCookie(key: string, ctx: RouterContext): string | undefined {
    // 兼容小写，有些浏览器自动将cookie的key转为小写
    return ctx.cookies.get(key) ?? ctx.cookies.get(String(key).toLowerCase());
  }
}
