import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Api } from '../../../constant/Api';
import { IUserAddReq } from '../../req-validate/user/IUserAddReq';
import { UserService } from '../../service/user/UserService';
import { CurrentLoginName } from '../../../decorator/controller/CurrentLoginName';
import { IPwdConfirmDeleteReq } from '../../req-validate/common/IDeleteReq';
import { IUserStatusReq } from '../../req-validate/user/IUserStatusReq';
import { IUserEditReq } from '../../req-validate/user/IUserEditReq';
import { IUserPwdReq } from '../../req-validate/user/IUserPwdReq';
import { ModuleEnum, OperationEnum } from '../../../enum/PermissionEnum';
import { ApiAuth } from '../../../decorator/controller/ApiAuth';
import { IListReq } from '../../req-validate/common/IListReq';
import { IUserDetailReq } from '../../req-validate/user/IUserDetailReq';

@JsonController()
@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(Api.USER_LIST)
  @ApiAuth(ModuleEnum.USER, OperationEnum.QUERY)
  public async userList(@Body({ validate: true }) body: IListReq) {
    return await this.userService.userList(body);
  }

  @Post(Api.USER_DETAIL)
  @ApiAuth(ModuleEnum.USER, OperationEnum.QUERY)
  public async userDetail(@Body({ validate: true }) body: IUserDetailReq) {
    return await this.userService.userDetail(body);
  }

  @Post(Api.USER_ADD)
  @ApiAuth(ModuleEnum.USER, OperationEnum.ADD)
  public async userAdd(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserAddReq,
  ) {
    return await this.userService.addUser(loginName, body);
  }

  @Post(Api.USER_DELETE)
  @ApiAuth(ModuleEnum.USER, OperationEnum.DELETE)
  public async delete(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IPwdConfirmDeleteReq,
  ) {
    return await this.userService.delUser(loginName, body);
  }

  @Post(Api.USER_STATUS)
  @ApiAuth(ModuleEnum.USER, OperationEnum.EDIT)
  public async editStatus(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserStatusReq,
  ) {
    return await this.userService.statusChange(loginName, body);
  }

  @Post(Api.USER_EDIT)
  @ApiAuth(ModuleEnum.USER, OperationEnum.EDIT)
  public async editUserInfo(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserEditReq,
  ) {
    return await this.userService.editUser(loginName, body);
  }

  @Post(Api.USER_PASSWORD)
  @ApiAuth(ModuleEnum.USER, OperationEnum.EDIT)
  public async editUserPassword(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserPwdReq,
  ) {
    return await this.userService.editUserPassword(loginName, body);
  }
}

export { UserController };
