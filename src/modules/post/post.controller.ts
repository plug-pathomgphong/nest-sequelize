import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: number) {
        const post = await this.postService.findOne(id);
        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist')
        }

        return post;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() newPost: CreatePostDto, @Request() req) {
        return await this.postService.create(newPost, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() updatePost: UpdatePostDto, @Request() req) {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, updatePost, req.user.userId);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return updatedPost;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.remove(id, req.user.userId);
        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return 'Successfully deleted';
    }
}
