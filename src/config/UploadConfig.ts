/**
 * @Author: ChenJF
 * @Date: 2024/2/28 15:38
 * @Description: 上传文件大小限制，上传临时目录清理之前日期的临时目录
 */
import moment from 'moment/moment';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';
import { NodeEnvTools } from '../tools/NodeEnvTools';
import path from 'path';
import fs from 'fs';
import { File } from 'formidable';
import { config } from './Config';

// 上传临时目录
export const uploadDir = NodeEnvTools.isDev()
  ? path.join(__dirname, '../../upload-tmp')
  : config.uploadTmpDir;

class UploadConfig {
  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 15:54
   * @Description: 初始化创建临时文件目录
   */
  public static initUploadTmpDir(): void {
    if (!fs.existsSync(uploadDir)) {
      try {
        // 目录不存在，创建目录
        fs.mkdirSync(uploadDir);
      } catch (e) {
        console.error('initCodeLog', `目录${uploadDir}创建失败`, e);
      }
    }
  }

  public static getConfig(): Partial<KoaBodyMiddlewareOptions> {
    return {
      multipart: true,
      formidable: {
        // 文件大小限制(10G)
        maxFileSize: 10 * 1024 * 1024 * 1024,
        // 保留文件扩展名
        keepExtensions: true,
        // 哈希算法
        hashAlgorithm: 'sha1',
        // 多文件上传
        multiples: true,
        // 文件前置处理（缓存清理）
        onFileBegin: (name: string, file: File) => {
          // 当天日期
          const date = moment().format('YYYY-MM-DD');
          const dir = path.join(uploadDir, date);
          if (!fs.existsSync(dir)) {
            // 目录不存在，创建日期目录
            fs.mkdirSync(dir);
            // 清除之前日期的临时目录和文件
            fs.readdir(uploadDir, (err, files) => {
              if (err !== null) {
                console.error(
                  'UploadConfig',
                  '读取文件上传临时存储目录失败',
                  err,
                );
                return;
              }

              files.forEach((fileName) => {
                const delFilePath = path.join(uploadDir, fileName);
                if (delFilePath !== dir) {
                  this.deleteAll(delFilePath);
                }
              });
            });
          }

          file.filepath = path.join(dir, file.newFilename);
        },
      },
    };
  }

  public static deleteAll(dirPath: string): void {
    if (fs.lstatSync(dirPath).isDirectory()) {
      // 目录删除
      fs.readdirSync(dirPath).forEach((file) => {
        const curPath = path.join(dirPath, file);
        this.deleteAll(curPath);
      });
      // 删除空目录
      fs.rmdirSync(dirPath);
    } else {
      // 从文件系统中删除文件
      fs.unlinkSync(dirPath);
    }
  }
}

export { UploadConfig };
