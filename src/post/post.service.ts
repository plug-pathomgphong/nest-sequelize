import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './interfaces/post.interface';
import { Post as PostRepo } from './entities/post.entity';

@Injectable()
export class PostService {

  constructor(@Inject('POSTS_REPOSITORY') private postRepo: typeof PostRepo) {

  }
  private readonly posts: Post[] = []
  create(createPostDto: CreatePostDto) {
    const newPost = { id: (this.posts.length+1).toString(), ...createPostDto}
    this.posts.push(newPost);
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
