import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './auth.jwt.secret';

@Injectable()
// 实现一个接口canactivate
export class AuthGuard implements CanActivate {
  // 引入属性
  constructor(
    // 在后面可以验证登录
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  // 在请求可以被处理之前的处理逻辑
  // 不包括login，要如何过略login？
  // 新建一个decorator，在里面创建一个注解Public
  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    // 官网标准写法
    // 通过getAllAndOverride拿到IS_PUBLIC_KEY
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }
    // 拿到用户请求对象
    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)
    if (!token) {
      // 没有token抛出错误
      throw new UnauthorizedException()
    }
    try {
      // verifyAsync解析token，在auth.service中生成
      const paylaod = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY
      })
      // 将解析过的payload放到request中，方便使用
      request['user'] = paylaod
    } catch(e) {
      throw new UnauthorizedException()
    }

    // 校验成功，放行
    // console.log('success')
    return true;
  }
}

// 从request对象中解析出token
function extractTokenFromHeader(requset) {
  const [type, token] = requset.headers.authorization?.split(' ') ?? []
  // console.log(token)
  return type === 'Bearer' ? token : 'wrong type'
}
