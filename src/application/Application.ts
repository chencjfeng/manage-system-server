import 'reflect-metadata';
import Koa from 'koa';
import { Container } from 'typedi';
import { useKoaServer, useContainer } from 'routing-controllers';
import path from 'path';
import koaBody from 'koa-body';
import { UploadConfig } from '../config/UploadConfig';
import { LogConfig } from '../config/LogConfig';
import { config } from '../config/Config';
import cookie from 'koa-cookie';
import { ErrorMiddleware } from '../middles/error/ErrorMiddleware';
import { LogsMiddleware } from '../middles/log/LogsMiddleware';
import { dbConfig } from '../config/DbConfig';
import { redisConfig } from '../config/RedisConfig';
import { AuthMiddleware } from '../middles/auth/AuthMiddleware';
import { API_PREFIX } from '../constant/Api';
import { authorizationChecker } from '../decorator/controller/ApiAuth';

/**
 * @Author: ChenJF
 * @Date: 2024/2/28 16:50
 * @Description: 启动服务
 */
class Application {
  private koaClient: Koa;

  public async createServer() {
    // 初始化上传文件临时目录
    UploadConfig.initUploadTmpDir();
    // 初始化日志工具
    LogConfig.initCodeLog();

    const koa: Koa = new Koa();
    // 上传文件配置
    koa.use(koaBody(UploadConfig.getConfig()));
    // cookie配置
    koa.use(cookie());

    // 重要：必须在所有routing-controllers操作前设置容器。
    // 注入外部di依赖到控制器中
    useContainer(Container);

    // 数据库链接启动
    await dbConfig.connectDb();

    // redis链接启动
    redisConfig.connectRedis();

    const app: Koa = useKoaServer<Koa>(koa, {
      routePrefix: API_PREFIX, // 接口前缀
      middlewares: [ErrorMiddleware, LogsMiddleware, AuthMiddleware], // 中间件
      controllers: [path.join(__dirname, `../app/controllers/**/*{.ts,.js}`)],
      validation: true,
      authorizationChecker, // api鉴权
    });

    app.listen(config.port);

    console.log(
      `koa服务已启动，启动端口为:${config.port}，访问服务可以通过：http://localhost:${config.port}`,
    );
    this.koaClient = app;
  }
}

// 单例
const application = new Application();
export { application };
