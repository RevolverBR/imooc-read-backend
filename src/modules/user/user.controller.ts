import { Body, Controller, Get, Post, Delete, Param, ParseIntPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { wrapperResponse } from 'src/utils';

@Controller('user')
export class UserController {
  // 第四步，使用userService
  constructor(private readonly userService: UserService) {}

  //
  @Get('info')
  getUserByToken(@Req() request) {
    return wrapperResponse(this.userService.findByUsername(request.user.username), "获取用户信息成功")
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  // 用户数据量大的时候需要分页操作
  @Get()
  getAllUser() {
    return this.userService.findAll()
  }

  @Post()
  create(@Body() body) {
    return this.userService.create(body)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id)
  }
}
