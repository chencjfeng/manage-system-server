import { IsString } from 'class-validator';

class ILoginReq {
  @IsString({
    message: 'loginName接收类型为string',
  })
  loginName: string;

  @IsString({
    message: 'password接收类型为string',
  })
  password: string;
}

interface ILoginResp {
  loginName: string;
  userName: string;
  token: string;
}

export { ILoginReq, type ILoginResp };
