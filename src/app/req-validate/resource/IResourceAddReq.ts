import { IAddReq } from '../common/IAddReq';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ResourceTypeEnum } from '../../../enum/ResourceEnum';

class IResourceAddReq extends IAddReq {
  @IsString({
    message: 'name接收类型为string',
  })
  @IsNotEmpty({
    message: 'name不能为空',
  })
  @Length(1, 128, {
    message: 'name最长为128个字符',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'description接收类型为string',
  })
  @Length(0, 256, {
    message: 'description最长为256个字符',
  })
  description?: string;

  @IsNotEmpty({ message: 'type不能为空' })
  @IsEnum(ResourceTypeEnum, { message: 'type接收类型为指定枚举值' })
  type: ResourceTypeEnum;
}

export { IResourceAddReq };
