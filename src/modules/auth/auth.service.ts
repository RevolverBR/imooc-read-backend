import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
// 使用md5加密密码
// import md5 from 'md5'
// TypeError: (0, md5_1.default) is not a function
import * as md5 from 'md5'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    // 在module中引入了usermodule，所以可以使用userService
    private userService: UserService,
    // 引入JWT
    private jwtService: JwtService
  ) {}

  // 创建一个login方法
  async login(username, password) {
    // 登录校验逻辑
    // 根据用户名查询用户是否存在
    const user = await this.userService.findByUsername(username)
    const md5Password = md5(password).toUpperCase()
    // console.log(md5Password)
    // console.log(user, md5Password)
    // 密码不一致抛出异常
    if (user.password !== md5Password) {
      // nestjs自带方法
      throw new UnauthorizedException()
    }

    const payload = { username: user.username, userid: user.id}

    // 生成返回一个jwttoken，然后就可以在登录接口拿到token
    return {
      // 用signAsync生产新的token签名
      token: await this.jwtService.signAsync(payload)
    }
  }
}