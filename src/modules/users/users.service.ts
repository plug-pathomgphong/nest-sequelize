import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/database/constants';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: typeof User){}

    async create(user: UserDto): Promise<User>{
        return await this.userRepo.create<User>(user);
    }

    async findOneByEmail(email:string): Promise<User>{
        return await this.userRepo.findOne<User>({ where: { email }})
    }

    async findOneById(id:number): Promise<User>{
        return await this.userRepo.findOne<User>({ where: { id }})
    }
}
