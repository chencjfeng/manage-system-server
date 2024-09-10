import { Service } from 'typedi';
import { FindOptionsWhere, getRepository } from 'typeorm';
import { RoleEntity } from '../../entity/RoleEntity';
import { BooleanEunm } from '../../../enum/CommonEnum';

@Service()
class RoleService {
  public async getRolesForIds(ids: number[]) {
    try {
      const where: FindOptionsWhere<RoleEntity> = {
        isDel: BooleanEunm.FALSE,
      };
      const repository = getRepository(RoleEntity)
        .createQueryBuilder('role')
        .where(where)
        .andWhere('role.id In (:...ids)', { ids });

      const roleList = await repository.getMany();
      console.log('[getRolesForIds]', ids, roleList);
      return roleList;
    } catch (err) {
      console.error('[getRolesForIds]', err);
      return [];
    }
  }
}

export { RoleService };
