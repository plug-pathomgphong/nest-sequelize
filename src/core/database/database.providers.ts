import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, PRODUCTION, TEST } from './constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/entities/user.entity';
import { Post } from '../../modules/post/entities/post.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config;

      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Post]);
      await sequelize.sync();
      return sequelize;
    },
  },
];