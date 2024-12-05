import { CRUDEntity } from '../../common/crud/CRUDEntity';

class IAddReq extends CRUDEntity {}

interface IAddResp {
  id: number;
}

export { IAddReq, type IAddResp };
