import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { POST_REPOSITORY } from '../../core/database/constants';
import * as SequelizeMock from 'sequelize-mock';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;
  let mockPost;

  beforeEach(async () => {
    // Create a mock Sequelize model for Post
    const DBConnectionMock = new SequelizeMock();
    mockPost = DBConnectionMock.define('post', {
      id: 1,
      title: 'Test Post',
      description: 'Test Description',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock User model to be included in Post queries
    const mockUserRepo = DBConnectionMock.define('User', {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });

    // Setup association in mock
    mockPost.belongsTo(mockUserRepo, { as: 'user', foreignKey: 'userId' });
    mockUserRepo.hasMany(mockPost, { as: 'posts', foreignKey: 'userId' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: POST_REPOSITORY,
          useValue: mockPost,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {

    it('should find all posts', async () => {
      const result = [
        { id: 1, title: 'Test Post', description: 'Test Description', userId: 1 },
        { id: 2, title: 'Test Post 2', description: 'Another Description', userId: 1 },
      ];
      mockPost.$queueResult(result);

      const posts = await service.findAll();
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Test Post');
      expect(posts[1].title).toBe('Test Post 2');
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const result = { id: 1, title: 'Test Post', description: 'Test Description', userId: 1 };
      mockPost.$queueResult(result);

      expect(await service.findOne(1)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const newPost: CreatePostDto = { title: 'New Post', description: 'Content' };
      const now = new Date();
      const result = { id: 1, ...newPost, userId: 1, createdAt: now, updatedAt: now };

      mockPost.$queueResult(result);

      const createdPost = await service.create(newPost, 1);
      // To account for slight differences in time, we manually set the createdAt and updatedAt fields in the result

      // Extract plain object representation from Sequelize instance
      const plainCreatedPost = createdPost.toJSON();

      // Ensure the dates are the same for comparison
      plainCreatedPost.createdAt = now;
      plainCreatedPost.updatedAt = now;

      expect(plainCreatedPost).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
       const updatePost: UpdatePostDto = { title: 'Updated Post', description: 'Updated Content' };
        const now = new Date();
        const result = [{ id: 1, ...updatePost, userId: 1, createdAt: now, updatedAt: now }];

        mockPost.$queueResult([1, result]);

        const updatedPostResponse = await service.update(1, updatePost, 1);

        const numberOfAffectedRows = updatedPostResponse.numberOfAffectedRows[0];
        const updatedPost = updatedPostResponse.numberOfAffectedRows[1][0];
        // Ensure the dates are the same for comparison
        // updatedPost.createdAt = now;
        // updatedPost.updatedAt = now;

        expect({ numberOfAffectedRows, updatedPost }).toEqual({ numberOfAffectedRows: 1, updatedPost: result[0] });
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      mockPost.$queueResult(1);

      expect(await service.remove(1, 1)).toEqual(1);
    });
  });


});
