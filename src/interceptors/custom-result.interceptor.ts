import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomResultInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next.handle().pipe(
      tap(result => {
        if (!result)
          return;
        
        if (result.hasOwnProperty('isSuccessful') && !result.isSuccessful &&result.hasOwnProperty('statusCode')) {
          throw new BadRequestException(result.message || 'Operation failed', result.statusCode);
        }
      })
    );
  }
}