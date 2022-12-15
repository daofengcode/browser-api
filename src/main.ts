import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { AllExceptionsFilter } from './filters/all.exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interception';
import { TrimPipe } from './pipes/trim.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(new TrimPipe(), new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const port = config().port;
  console.log(`listening on port ${port}...`);
  await app.listen(port);
}
bootstrap();
