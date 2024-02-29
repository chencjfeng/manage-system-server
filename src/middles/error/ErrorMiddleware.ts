import { Service } from 'typedi';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { RouterContext } from 'koa-router';
import { Next } from 'koa';
import { CommonTools } from '../../tools/CommonTools';
import { HttpCode } from '../../constant/HttpCode';
import { CodeEnum } from '../../enum/CodeEnum';

interface ICtxRouterContent extends RouterContext {
  body: {
    common?: any;
    errors?: any;
  };
}

/**
 * @Author: ChenJF
 * @Date: 2024/2/29 09:46
 * @Description: 错误处理
 */
@Service()
@Middleware({ type: 'before' })
export class ErrorMiddleware implements KoaMiddlewareInterface {
  async use(ctx: ICtxRouterContent, next: Next): Promise<void> {
    try {
      await next();
    } finally {
      if (!ctx.body) {
        ctx.body = {};
      }
      // 处理参数校验错误
      if (
        ctx?.status === HttpCode.BAD_REQUEST &&
        (ctx?.body as any)?.name === 'BadRequestError'
      ) {
        ctx.status = 200;
        const { errors, common } = ctx.body;
        const newData = {};
        if (Array.isArray(errors) && errors.length > 0) {
          errors.forEach((item) => {
            const map = item?.constraints || {};
            newData[item?.property] = Object.values(map);
          });
        }
        const body = CommonTools.returnData(
          newData,
          CodeEnum.COMMON_PARAMS_ERROR,
        );
        ctx.body = {
          ...body,
          common,
        };
      } else if (ctx.status === HttpCode.NOT_METHOD) {
        // 找不到接口
        ctx.status = HttpCode.NOT_FOUND;
        const { errors, common } = ctx.body;
        const body = CommonTools.returnData(
          errors,
          HttpCode.NOT_FOUND,
          'Not Found',
        );
        ctx.body = {
          ...body,
          common,
        };
      } else if (ctx.status !== HttpCode.SUCCESS && !ctx.body) {
        // 其他接口错误信息
        const { errors, common } = ctx.body;
        const { status } = ctx;
        const body = CommonTools.returnData(
          errors,
          status,
          ctx.response.message || 'Api Error',
        );
        ctx.body = {
          ...body,
          common,
        };
        ctx.status = status;
      }
    }
  }
}
