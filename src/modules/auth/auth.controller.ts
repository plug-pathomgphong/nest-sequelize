import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @ApiBody({
        description: 'Login api',
        type: LoginDto
    })
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    // @UseGuards(DoesUserExist)
    @Post('signup')
    async signup(@Body() user: UserDto) {
        return await this.authService.register(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
