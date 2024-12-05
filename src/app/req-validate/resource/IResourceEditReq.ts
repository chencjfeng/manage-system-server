import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IEditReq } from '../common/IEditReq';

class IResourceEditReq extends IEditReq {
  @IsOptional()
  @IsString({
    message: 'name接收类型为string',
  })
  @IsNotEmpty({
    message: 'name不能为空',
  })
  @Length(1, 128, {
    message: 'name最长为128个字符',
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'description接收类型为string',
  })
  @Length(0, 256, {
    message: 'description最长为256个字符',
  })
  description?: string;
}

export { IResourceEditReq };
