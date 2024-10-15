import { IsInt, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../entity/UserEntity';

class IUserDetailReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}

interface IUserDetailResp extends UserEntity {}

export { IUserDetailReq, type IUserDetailResp };
