import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { AesTools } from '../../tools/AesTools';

@ValidatorConstraint({ name: 'isDecryptPwd', async: false })
export class IsDecryptPwdConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const decryptPwd = AesTools.decryptData(value, AesTools.BROWSER_SEC_KEY);
    return !!decryptPwd;
  }

  defaultMessage(args: ValidationArguments) {
    return '密码解密失败';
  }
}

export function IsDecryptPwd(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDecryptPwdConstraint,
    });
  };
}
