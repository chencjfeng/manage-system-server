import { JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@JsonController()
@Service()
class RoleController {}

export { RoleController };
