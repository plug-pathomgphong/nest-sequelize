import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }
    async register(data: UserDto) {
        // Check if email exists should return
        const userExists = await this.usersService.findOneByEmail(data.email);
        if(userExists){
            throw new ForbiddenException('This email already exist');
        }
        // Generate salt
        const salt = randomBytes(8).toString('hex')

        // Hash password
        const hash = (await scrypt(data.password, salt, 32)) as Buffer;

        const passwordHashed = salt + '.' + hash.toString('hex');

        // Store to database
        const newUser = await this.usersService.create({ ...data, password: passwordHashed});
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const payload = { email: data.email, sub: newUser.id };
        const token = await this.generateToken(payload)

        return { user: result, accessToken: token}

    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return null;
        }
        const { password, ...result } = user['dataValues'];
        const salt = password.split('.')[0]
        const hashedPassword = password.split('.')[1]
        const hash = (await scrypt(pass, salt, 32)) as Buffer
        if(hashedPassword !== hash.toString('hex')){
            return null;
        }
        console.log(result)
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const token = await this.generateToken(payload)
        return {
            access_token: token,
        };
    }

    private async generateToken(payload){
        return await this.jwtService.signAsync(payload);
    }

  
}
