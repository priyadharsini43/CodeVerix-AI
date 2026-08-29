import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const result = await this.authService.register(registerDto);
    const isProd = process.env.NODE_ENV === 'production';

    // Set HTTP-Only Cookie for secure auth
    response.setCookie('access_token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return {
      user: result.user,
      token: result.token,
      message: 'Registration successful',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const result = await this.authService.login(loginDto);
    const isProd = process.env.NODE_ENV === 'production';

    // Set HTTP-Only Cookie for secure auth
    response.setCookie('access_token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return {
      user: result.user,
      token: result.token,
      message: 'Login successful',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }
}
