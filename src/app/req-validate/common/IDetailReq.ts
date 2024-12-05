import { IsInt, IsNotEmpty } from 'class-validator';

class IDetailReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}

export { IDetailReq };
