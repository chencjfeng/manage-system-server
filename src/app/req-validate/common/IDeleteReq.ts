import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { IsDecryptPwd } from '../../../decorator/validator/IsDecryptPwd';

class IDeleteReq {
  @IsArray({
    message: 'ids接收类型为数组',
  })
  @IsInt({
    each: true,
    message: 'ids接收类型为整形数字数组',
  })
  @ArrayNotEmpty({
    message: 'ids不能为空',
  })
  ids: number[];
}

/**
 * @Author: ChenJF
 * @Date: 2024/8/26 10:32
 * @Description: 二次确认删除，需要确认当前登录用户的密码
 */
class IPwdConfirmDeleteReq extends IDeleteReq {
  @IsString({
    message: 'confirmPwd接收类型为字符串',
  })
  @IsNotEmpty({
    message: 'confirmPwd字段不能为空',
  })
  @IsDecryptPwd({ message: 'confirmPwd密码错误，请确认加密方式' })
  confirmPwd: string;
}

export { IDeleteReq, IPwdConfirmDeleteReq };
