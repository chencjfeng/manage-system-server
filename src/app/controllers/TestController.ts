import { Get, JsonController, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../constant/Api';
import { CommonTools } from '../../tools/CommonTools';
import { ITestReq } from '../req-validate/ITestReq';

@JsonController()
@Service()
class TestController {
  @Get(Api.TEST)
  public async test(@QueryParams({ validate: true }) query: ITestReq) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log(query);
        resolve(true);
      }, 1000);
    });
    await promise;
    return CommonTools.returnData('success');
  }
}

export { TestController };
