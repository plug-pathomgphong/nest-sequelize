import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { postProviders } from './entities/post.providers';

@Module({
  providers: [PostService, ...postProviders],
  controllers: [PostController]
})
export class PostModule {}
