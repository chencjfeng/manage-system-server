import { IsInt, IsNotEmpty } from 'class-validator';

class IEditReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}

interface IEditResp {
  id: number;
}

export { IEditReq, type IEditResp };
