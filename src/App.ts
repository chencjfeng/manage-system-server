import { Application } from './application/Application';

/**
 * @Author: ChenJF
 * @Date: 2024/2/28 16:05
 * @Description: 全局错误捕获
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at Promise:', promise);
  console.error('Reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // 为避免意外而导致应用不稳定，最好提前关闭它（追踪更多错误、关闭数据库连接等），再重启应用
  process.exit(1);
});

process.on('exit', (code) => {
  console.error(`About to exit with code：${code}`);
});

void Application.createServer();
