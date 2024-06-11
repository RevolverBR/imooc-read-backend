import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
// npm install -S @nestjs/jwt
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './auth.jwt.secret';

@Module({
  // 实现登录鉴权接口调用链路第一步，引入UserModule模块，使用其中的userservice
  imports: [
    UserModule,
    // 使用JWT
    JwtModule.register({
      global: true,
      // 私钥
      secret: JWT_SECRET_KEY,
      // 过期时间,24h
      signOptions: { expiresIn: 24 * 60 * 60 + 's'}
    })
  ],
  controllers: [AuthController],
  // 开发请求守卫，第一步注入请求守卫
  providers: [
    AuthService,
    // 要用一个对象
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}
