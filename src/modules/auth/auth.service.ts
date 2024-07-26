import { Inject, Injectable } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }
    async register(email: string, pass: string) {
        const salt = randomBytes(8).toString('hex')

    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return null;
        }
        const salt = '';
        const hash = (await scrypt(pass, salt, 32)) as Buffer;
        if (user.password != hash.toString('hex')) {
            return null
        }
        const { password, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

  
}
