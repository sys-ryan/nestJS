import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// import cookieSession from 'cookie-session';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Set global pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, //do not allow any additional property other than registered ones on requests.
      }),
    },
  ],
})
export class AppModule {
  // set global middleare
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasdf'], //used to encrypt information inside cookeis
        }),
      )
      .forRoutes('*'); //make use of this middleware on every single incoming request
  }
}
