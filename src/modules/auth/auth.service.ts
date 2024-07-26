import { Injectable } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    register(){
        const salt = randomBytes(8).toString('hex')
        
    }
}
