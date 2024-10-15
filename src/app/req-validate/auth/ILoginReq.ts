import { IsString } from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';
import { UserEntity } from '../../entity/UserEntity';

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

export { ILoginReq, type ILoginResp };
