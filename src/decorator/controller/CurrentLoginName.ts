import { createParamDecorator } from 'routing-controllers';
import { CtxHeaderTools } from '../../tools/CtxHeaderTools';

/**
 * @Author: ChenJF
 * @Date: 2024/8/22 11:37
 * @Description: 当前登录名
 */
export function CurrentLoginName() {
  return createParamDecorator({
    required: true,
    value: (action) => {
      const loginName: string =
        action.request.header[CtxHeaderTools.LOGIN_NAME];
      if (!loginName) {
        return '';
      }

      return loginName;
    },
  });
}
