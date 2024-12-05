import { Service } from 'typedi';
import { CRUDService } from '../../common/crud/CRUDService';
import { ResourceEntity } from '../../entity/ResourceEntity';
import { getRepository, Repository } from 'typeorm';

@Service()
class ResourceService extends CRUDService<ResourceEntity> {
  readonly isDelColumn = true;
  getRepo(): Repository<ResourceEntity> {
    return getRepository(ResourceEntity);
  }
}

export { ResourceService };
