import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import { CustomResultInterceptor } from './interceptors/custom-result.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
    exceptionFactory: (errors) => {
      const messages = errors.map(
        (error) => `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}`
      );
      return new BadRequestException(messages);
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  app.useGlobalInterceptors(new CustomResultInterceptor(new Reflector()));
  
  await app.listen(3000);
  
}
bootstrap();
