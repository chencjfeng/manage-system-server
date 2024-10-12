import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { ApiAuth } from '../../../decorator/controller/ApiAuth';
import {
  getAllPermissionList,
  ModuleEnum,
  OperationEnum,
} from '../../../enum/PermissionEnum';
import { CurrentLoginName } from '../../../decorator/controller/CurrentLoginName';
import { RoleService } from '../../service/role/RoleService';
import { IRoleAddReq } from '../../req-validate/role/IRoleAddReq';
import { IRoleEditReq } from '../../req-validate/role/IRoleEditReq';
import { IDeleteReq } from '../../req-validate/common/IDeleteReq';
import { CommonTools } from '../../../tools/CommonTools';

@JsonController()
@Service()
class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post(Api.ROLE_PERMISSION_LIST)
  @ApiAuth(ModuleEnum.ROLE, OperationEnum.QUERY)
  public permissionList() {
    const permissionList = getAllPermissionList();
    return CommonTools.returnData(permissionList);
  }

  @Post(Api.ROLE_ADD)
  @ApiAuth(ModuleEnum.ROLE, OperationEnum.ADD)
  public async roleAdd(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IRoleAddReq,
  ) {
    return await this.roleService.addRole(loginName, body);
  }

  @Post(Api.ROLE_EDIT)
  @ApiAuth(ModuleEnum.ROLE, OperationEnum.EDIT)
  public async roleEdit(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IRoleEditReq,
  ) {
    return await this.roleService.editRole(loginName, body);
  }

  @Post(Api.ROLE_DELETE)
  @ApiAuth(ModuleEnum.ROLE, OperationEnum.DELETE)
  public async roleDelete(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IDeleteReq,
  ) {
    return await this.roleService.delRole(loginName, body);
  }
}

export { RoleController };
