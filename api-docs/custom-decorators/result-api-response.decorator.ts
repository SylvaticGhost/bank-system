import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import * as defaultResponseExamples from '../response-examples/default-reponses.json';

/**
 * Decorator wraps the `ApiResponse` decorator and sets the default response object for the method:
 * 
 * status: 200,
 * 
 * description: 'return default result object',
 * 
 * schema: { example: "successResult": {
 *     "isSuccessful": true,
 *     "message": "",
 *     "statusCode": 200
 *   } },
 */
export function ApiDefaultResultResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'return default result object',
      schema: { example: defaultResponseExamples.successResult },
    }),
  );
}