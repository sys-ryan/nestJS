import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: ['asdfasdf'], //used to encrypt information inside cookeis
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //do not allow any additional property other than registered ones on requests.
    }),
  );

  await app.listen(3000);
}
bootstrap();
