import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tự động kiểm tra dữ liệu đầu vào (DTO)
  app.useGlobalPipes(new ValidationPipe());

  // Tự động ẩn các trường có @Exclude() trong Entity
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();
  await app.listen(3000);
}
bootstrap().catch(console.error);
