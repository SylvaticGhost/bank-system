import { ApiParam } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

/**
 * Decorator wraps the `ApiParam` decorator and sets the default response object for the method and IsUUID validation:
 * 
 * name: 'accountId',
 * 
 * description: 'The ID of the account to retrieve operations for',
 * 
 * example: 'd33b52a8-629a-4a48-873b-99080197d64d',
 * 
 * type: 'string',
 */
export function ApiAccountIdParam() {
  return applyDecorators(
    ApiParam({
      name: 'accountId',
      description: 'The ID of the account to retrieve operations for',
      example: 'd33b52a8-629a-4a48-873b-99080197d64d',
      type: 'string',
    }),
    IsUUID()
  );
}