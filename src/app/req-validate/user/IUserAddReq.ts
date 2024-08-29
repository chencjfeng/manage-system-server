import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';

class IUserAddReq {
  @IsString({
    message: 'loginName接收类型为string',
  })
  @IsNotEmpty({
    message: 'loginName不能为空',
  })
  loginName: string;

  @IsString({
    message: 'password接收类型为string',
  })
  @IsNotEmpty({
    message: 'password不能为空',
  })
  @IsDecryptPwd({ message: 'password密码错误，请确认加密方式' })
  password: string;

  @IsString({
    message: 'username接收类型为string',
  })
  @IsNotEmpty({
    message: 'username不能为空',
  })
  username: string;

  @IsArray({
    message: 'roleIds接收类型为数组',
  })
  @IsInt({
    each: true,
    message: 'roleIds接收类型为整形数字数组',
  })
  @ArrayNotEmpty({
    message: 'roleIds不能为空',
  })
  roleIds: number[];
}

/**
 * @Author: ChenJF
 * @Date: 2024/8/20 15:48
 * @Description: 创建返回id
 */
interface IUserAddResp {
  id: number;
}

export { IUserAddReq, type IUserAddResp };
