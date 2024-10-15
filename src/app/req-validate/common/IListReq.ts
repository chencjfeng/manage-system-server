import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

function isStringArray(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isNumberArray(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'number')
  );
}

class ISearch {
  @IsString({ message: 'search中name接收类型为字符串' })
  @MinLength(1, { message: 'search中name值最小长度为1' })
  name: string; // 过滤键的名称

  @IsArray({ message: 'search中values接收类型为数组' })
  @ArrayMinSize(1, { message: 'search中values值数组最小长度为1' })
  @Validate(isStringArray, { message: 'search中values接收类型为字符串数组' })
  @Validate(isNumberArray, { message: 'search中values接收类型为数字数组' })
  values: string[] | number[]; // 一个或多个过滤值

  @IsOptional()
  @IsBoolean({ message: 'search中exactMatch接收类型为布尔' })
  exactMatch?: boolean; // 是否模糊查询
}

/**
 * @Author: ChenJF
 * @Date: 2024/10/14 09:44
 * @Description: 列表请求参数
 */
class IListReq {
  @IsOptional()
  @IsInt({ message: 'pageIndex接收类型为整形数字' })
  @Min(1, { message: 'pageIndex接收最小值为1' })
  pageIndex?: number = 1; // 分页，第几页，从1开始

  @IsOptional()
  @IsInt({ message: 'pageSize接收类型为整形数字' })
  @Min(1, { message: 'pageSize接收最小值为1' })
  pageSize?: number = 20; // 分页返回数量，默认20

  @IsOptional()
  @IsString({ message: 'by接收类型为字符串' })
  by?: string; // 排序字段

  @IsOptional()
  @IsEnum(OrderEnum, { message: 'order接收值应该为asc或desc' })
  order?: OrderEnum = OrderEnum.DESC; // 排序方式，默认desc

  @IsOptional()
  @IsArray({ message: 'search接收类型为数组' })
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => ISearch) // 使用 class-transformer 库来实例化 Search 类
  search?: ISearch[];
}

interface IListResp<T> {
  rows: T[]; // 数组
  total: number; // 总数
}

export { OrderEnum, ISearch, IListReq, type IListResp };
