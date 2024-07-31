import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;
  const posts = [
    { id: 1, title: 'Test Post', description: 'Test Description', userId: 1 },
    { id: 2, title: 'Test Post 2', description: 'Test Description 2', userId: 2 }
  ]
  const mockPostService = {
    findAll: jest.fn().mockResolvedValue(posts),
    findOne: jest.fn().mockImplementation((id: number) => {
      return posts.find(post => post.id === id);
    }),
    create: jest.fn().mockImplementation((post: CreatePostDto, userId: number) => ({ id: 1, ...post, userId })),
    update: jest.fn().mockImplementation((id: number, post: UpdatePostDto, userId: number) => {
      const find = posts.find(post => post.id === id);
      return find ? { numberOfAffectedRows: 1, updatedPost: { id: 1, ...post, userId } } : { numberOfAffectedRows: 0 }
    }

    ),
    remove: jest.fn().mockImplementation((id: number, userId: number) => posts.find(post => post.id === id) ? 1 : 0),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{
        provide: PostService,
        useValue: mockPostService,
      }],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all posts', async () => {
    const result = await controller.findAll()
    expect(result).toEqual(posts)
    expect(postService.findAll).toHaveBeenCalled()
  });

  it('should return single post', async () => {
    const post = { id: 2, title: 'Test Post 2', description: 'Test Description 2', userId: 2 }
    const result = await controller.findOne(2)
    expect(result).toEqual(post)
    expect(postService.findOne).toHaveBeenCalledWith(2)
  });

  it('should throw NotFoundException when post not found', async () => {
    try {
      await controller.findOne(3);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('This Post doesn\'t exist');
    }
  });

  it('should create a new post', async () => {
    const newPost: CreatePostDto = { title: 'New Post', description: 'New Description' };
    const req = { user: { userId: 1 } };
    const result = await controller.create(newPost, req);
    expect(result).toEqual({ id: 1, ...newPost, userId: 1 });
    expect(postService.create).toHaveBeenCalledWith(newPost, 1);
  });

  it('should update a post', async () => {
    const updatePost: UpdatePostDto = { title: 'Updated Post', description: 'Updated Description' };
    const req = { user: { userId: 1 } };
    const result = await controller.update(1, updatePost, req);
    expect(result).toEqual({ id: 1, ...updatePost, userId: 1 });
    expect(postService.update).toHaveBeenCalledWith(1, updatePost, 1);
  });

  it('should throw NotFoundException when updating a post that does not exist', async () => {
    const updatePost: UpdatePostDto = { title: 'Updated Post 3', description: 'Updated Description 3' };
    const req = { user: { userId: 1 } };
    try {
      await controller.update(3, updatePost, req);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('This Post doesn\'t exist');
    }
  });

  it('should delete a post', async () => {
    const req = { user: { userId: 1 } };
    const result = await controller.remove(1, req);
    expect(result).toEqual('Successfully deleted');
    expect(postService.remove).toHaveBeenCalledWith(1, 1);
  });


  it('should throw NotFoundException when deleting a post that does not exist', async () => {
    const req = { user: { userId: 1 } };
    try {
      await controller.remove(3, req);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('This Post doesn\'t exist');
    }
  });

});
