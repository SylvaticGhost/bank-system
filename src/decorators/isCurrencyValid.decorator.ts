import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import {CURRENCIES} from "../account/currencies";


export function IsCurrencyValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(CURRENCIES).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid currency (${Object.values(CURRENCIES).join(', ')})`;
        }
      }
    });
  };
}