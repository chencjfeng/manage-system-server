import { Service } from 'typedi';
import { FindOptionsWhere, getRepository } from 'typeorm';
import { UserEntity } from '../../entity/UserEntity';

@Service()
class UserService {
  public async getUserInfoForLoginName(loginName: string) {
    const where: FindOptionsWhere<UserEntity> = {
      loginName,
    };
    const repository = getRepository(UserEntity)
      .createQueryBuilder('user')
      .addSelect('user.password') // 默认password字段不select，这里要加上用于登录密码校验
      .where(where);
    const userInfo = await repository.getOne();
    console.log('[getUserInfoForLoginName]', loginName, userInfo);
    return userInfo;
  }
}

export { UserService };
