import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { Next } from 'koa';
import { RouterContext } from 'koa-router';
import { NodeEnvTools } from '../../tools/NodeEnvTools';
import { RandomTools } from '../../tools/RandomTools';
import { LogConfig } from '../../config/LogConfig';
import { CtxHeaderTools } from '../../tools/CtxHeaderTools';

/**
 * controller 拦截器
 * 拦截 controller 被访问前，进行访问的日志记录
 */
@Middleware({ type: 'before' })
@Service()
export class LogsMiddleware implements KoaMiddlewareInterface {
  async use(ctx: RouterContext, next: Next): Promise<void> {
    const startTime: number = Date.now();
    const requestId: string = RandomTools.getRequestId();
    ctx.header[CtxHeaderTools.REQUEST_ID] = requestId;
    try {
      await next();
    } catch (error) {
      ctx.response.status = error.status || 500;
      ctx.response.body = {
        message: error.message,
        stack: NodeEnvTools.isDev()
          ? String.toString.call(error.stack)
          : undefined,
      };
    } finally {
      const timeGap = Date.now() - startTime;
      const { method, url } = ctx.request;
      const logData = {
        url,
        method,
        time: timeGap,
        status: ctx.status,
        headers: ctx.req.headers,
        request: {
          query: ctx.request.query || {},
          body: ctx.request.body || {},
          params: ctx.params || {},
        },
        response: {
          body: ctx.body,
        },
        requestId,
      };
      // 访问日志打印
      LogConfig.accessLog(JSON.stringify(logData));

      const { status } = ctx;
      // 避免body不存在
      if (!ctx.body) {
        ctx.body = {};
      }

      // 返回参数增加common字段，返回耗时和requestId
      console.log(ctx.body);
      (ctx.body as any).common = {
        time: timeGap,
        requestId,
      };
      // 需要重新赋值status，更新body会将status重置为200
      ctx.status = status;
    }
  }
}
