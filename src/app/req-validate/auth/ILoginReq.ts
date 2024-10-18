import { IsString } from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';
import { UserEntity } from '../../entity/UserEntity';
import { RouterContext } from 'koa-router';
import { CommonReturnInterface } from '../../../tools/CommonTools';
import { CodeEnum } from '../../../enum/CodeEnum';

class ILoginReq {
  @IsString({
    message: 'loginName接收类型为string',
  })
  loginName: string;

  @IsString({
    message: 'password接收类型为string',
  })
  @IsDecryptPwd({
    message: 'password内容解密失败',
  })
  password: string;
}

interface ILoginResp {
  userInfo: UserEntity;
  token: string;
}

interface ILoginParams {
  ctx: RouterContext; // 请求体
  loginName: string; // 登录名
  loginStatus: CodeEnum; // 登录状态
  loginMsg: string; // 登录返回信息
}

export { ILoginReq, type ILoginResp, type ILoginParams };
