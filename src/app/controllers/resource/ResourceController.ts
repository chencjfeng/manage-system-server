import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { ApiAuth } from '../../../decorator/controller/ApiAuth';
import { ModuleEnum, OperationEnum } from '../../../enum/PermissionEnum';
import { IListReq } from '../../req-validate/common/IListReq';
import { CurrentLoginName } from '../../../decorator/controller/CurrentLoginName';
import { IDeleteReq } from '../../req-validate/common/IDeleteReq';
import { ResourceService } from '../../service/resource/ResourceService';
import { IDetailReq } from '../../req-validate/common/IDetailReq';
import { IResourceAddReq } from '../../req-validate/resource/IResourceAddReq';
import { IResourceEditReq } from '../../req-validate/resource/IResourceEditReq';
import { HashTools } from '../../../tools/HashTools';

@JsonController()
@Service()
class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post(Api.RESOURCE_LIST)
  @ApiAuth(ModuleEnum.RESOURCE, OperationEnum.QUERY)
  public async getList(@Body({ validate: true }) body: IListReq) {
    return await this.resourceService.getList(body);
  }

  @Post(Api.RESOURCE_DETAIL)
  @ApiAuth(ModuleEnum.RESOURCE, OperationEnum.QUERY)
  public async getDetail(@Body({ validate: true }) body: IDetailReq) {
    return await this.resourceService.getDetail(body);
  }

  @Post(Api.RESOURCE_ADD)
  @ApiAuth(ModuleEnum.RESOURCE, OperationEnum.ADD)
  public async resourceAdd(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IResourceAddReq,
  ) {
    // 生成device_num设备编号
    const deviceNum = HashTools.sha256(
      `${loginName}_${body.type}_${new Date().getTime()}`,
    );
    return await this.resourceService.add(loginName, { ...body, deviceNum });
  }

  @Post(Api.RESOURCE_EDIT)
  @ApiAuth(ModuleEnum.RESOURCE, OperationEnum.EDIT)
  public async resourceEdit(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IResourceEditReq,
  ) {
    return await this.resourceService.edit(loginName, body);
  }

  @Post(Api.RESOURCE_DELETE)
  @ApiAuth(ModuleEnum.RESOURCE, OperationEnum.DELETE)
  public async resourceDelete(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IDeleteReq,
  ) {
    return await this.resourceService.delete(loginName, body);
  }
}

export { ResourceController };
