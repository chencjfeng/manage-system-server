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

@JsonController()
@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(Api.USER_ADD)
  public async userAdd(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserAddReq,
  ) {
    return await this.userService.addUser(loginName, body);
  }

  @Post(Api.USER_DELETE)
  public async delete(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IPwdConfirmDeleteReq,
  ) {
    return await this.userService.delUser(loginName, body);
  }

  @Post(Api.USER_STATUS)
  public async editStatus(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserStatusReq,
  ) {
    return await this.userService.statusChange(loginName, body);
  }

  @Post(Api.USER_EDIT)
  public async editUserInfo(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserEditReq,
  ) {
    return await this.userService.editUser(loginName, body);
  }

  @Post(Api.USER_PASSWORD)
  public async editUserPassword(
    @CurrentLoginName() loginName: string,
    @Body({ validate: true }) body: IUserPwdReq,
  ) {
    return await this.userService.editUserPassword(loginName, body);
  }
}

export { UserController };
