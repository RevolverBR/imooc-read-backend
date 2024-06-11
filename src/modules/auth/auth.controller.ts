import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { success, error } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  login(@Body() params) {
    // 用封装的方法返回登录结果状态
    return this.authService
      .login(params.username, params.password)
      .then((data) => success(data, '登录成功'))
      .catch((err) => error(err.message))
  }
}