import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

class IUserEditReq {
  @IsInt({
    message: 'id接收类型为整形数字',
  })
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;

  @IsOptional()
  @IsString({
    message: 'username接受类型为字符串',
  })
  @Length(1, 128, {
    message: 'username最长为128个字符',
  })
  username?: string;
}

interface IUserEditResp {
  id: number;
}

export { IUserEditReq, type IUserEditResp };
