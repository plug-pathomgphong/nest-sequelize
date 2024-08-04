import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    PostModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe, }],
})
export class AppModule { }
