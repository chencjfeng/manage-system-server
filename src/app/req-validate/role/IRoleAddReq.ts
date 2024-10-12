import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

class IRoleAddReq {
  @IsString({
    message: 'name接收类型为string',
  })
  @IsNotEmpty({
    message: 'name不能为空',
  })
  name: string;

  @IsArray({
    message: 'permissions接收类型为数组',
  })
  @IsString({
    each: true,
    message: 'permissions接收类型为字符串数组',
  })
  @ArrayNotEmpty({
    message: 'permissions不能为空',
  })
  permissions: string[];
}

/**
 * @Author: ChenJF
 * @Date: 2024/10/11 16:49
 * @Description: 创建返回id
 */
interface IRoleAddResp {
  id: number;
}

export { IRoleAddReq, type IRoleAddResp };
