import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

class IRoleEditReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;

  @IsOptional()
  @IsString({
    message: 'name接受类型为字符串',
  })
  @Length(1, 128, {
    message: 'name最长为128个字符',
  })
  name?: string;

  @IsOptional()
  @IsArray({
    message: 'permissions接收类型为数组',
  })
  @IsString({
    each: true,
    message: 'permissions接收类型为字符串数组',
  })
  permissions?: string[];
}

/**
 * @Author: ChenJF
 * @Date: 2024/10/11 16:49
 * @Description: 创建返回id
 */
interface IRoleEditResp {
  id: number;
}

export { IRoleEditReq, type IRoleEditResp };
