import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_REPOSITORY } from '../../core/database/constants';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostService {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: typeof Post) { }

    async findAll() {
        return await this.postRepo.findAll<Post>({ order: [['createdAt', 'ASC']], include: [{ model: User, attributes: { exclude: ['password'] } }] });
    }
    async findOne(id: number) {
        return await this.postRepo.findOne({ where: { id }, include: [{ model: User, attributes: { exclude: ['password'] } }] });
    }
    async create(newPost: CreatePostDto, userId: number) {
        return await this.postRepo.create<Post>({ ...newPost, userId });
    }
    async update(id: number, updatePost: UpdatePostDto, userId: number) {
        // console.log(id, updatePost, userId)
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepo.update<Post>(updatePost, { where: { id, userId }, returning: true });
        return {numberOfAffectedRows, updatedPost};
    }
    async remove(id: number, userId: number) {
        return await this.postRepo.destroy({ where: { id, userId }});
    }
}
