import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

/**
 * Decorator wraps the `ApiProperty` decorator and sets the default response object for the method and IsUUID validation:
 * 
 * description: 'Account identifier',
 * 
 * example: 'f686ae79-137c-4ed4-bc11-1a46ea4b63c3',
 * 
 * required: true,
 */
export function ApiAccountIdProperty() {
  return applyDecorators(
    ApiProperty({
      description: 'Account identifier',
      example: 'f686ae79-137c-4ed4-bc11-1a46ea4b63c3',
      required: true,
    }),
    IsUUID()
  );
}