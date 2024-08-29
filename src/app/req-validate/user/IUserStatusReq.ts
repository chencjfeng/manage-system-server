import { UserStatusEnum } from '../../entity/UserEntity';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

class IUserStatusReq {
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

  @IsNotEmpty({ message: 'status不能为空' })
  @IsEnum(UserStatusEnum, { message: 'status接收类型为指定枚举值' })
  status: UserStatusEnum;
}

export { IUserStatusReq };
