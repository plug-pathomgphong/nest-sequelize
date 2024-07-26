import { Post } from "./post.entity";

export const postProviders = [
    {
      provide: 'POSTS_REPOSITORY',
      useValue: Post,
    },
  ];