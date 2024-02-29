import { IsMobilePhone, IsString, Min } from 'class-validator';

class ITestReq {
  @IsString({
    message: 'test接收类型为string',
  })
  @IsMobilePhone('zh-CN', undefined, {
    message: 'test号码格式校验失败',
  }) // 中国手机号
  test: string;

  @IsString({
    message: 'test2接收类型为string',
  })
  @Min(1, {
    message: 'test2最小长度最少为1',
  })
  test2: string;
}

export { ITestReq };
