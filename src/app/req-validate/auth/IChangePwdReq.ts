import { IsNotEmpty, IsString } from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';

class IChangePwdReq {
  @IsNotEmpty({ message: 'oldPassword不能为空' })
  @IsString({
    message: 'oldPassword接收类型为字符串',
  })
  @IsDecryptPwd({ message: 'oldPassword密码错误，请确认加密方式' })
  oldPassword: string;

  @IsNotEmpty({ message: 'newPassword不能为空' })
  @IsString({
    message: 'newPassword接收类型为字符串',
  })
  @IsDecryptPwd({ message: 'newPassword密码错误，请确认加密方式' })
  newPassword: string;
}

interface IChangePwdResp {
  loginName: string;
}

export { IChangePwdReq, type IChangePwdResp };
