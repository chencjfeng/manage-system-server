import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';

class IUserPwdReq {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  id: number;

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

interface IUserPwdResp {
  id: number;
}

export { IUserPwdReq, type IUserPwdResp };
