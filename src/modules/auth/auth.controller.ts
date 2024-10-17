import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { success, error, wrapperResponse } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 标识通过guard
  @Public()
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  login(@Body() params) {
    // 用封装的方法返回登录结果状态
    return wrapperResponse(
      this.authService.login(params.username, params.password),
      '登录成功'
    )
  }
}
