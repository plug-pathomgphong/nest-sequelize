import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './entities/users.providers';

@Module({
  providers: [UsersService, ...usersProviders],
  exports:[UsersService]
})
export class UsersModule {}
