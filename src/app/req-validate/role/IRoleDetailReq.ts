import { IsInt, IsNotEmpty } from 'class-validator';
import { RoleEntity } from '../../entity/RoleEntity';

class IRoleDetailReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}

interface IRoleDetailResp extends RoleEntity {}

export { IRoleDetailReq, type IRoleDetailResp };
