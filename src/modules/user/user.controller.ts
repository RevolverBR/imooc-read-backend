import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { wrapperResponse } from 'src/utils';

@Controller('user')
export class UserController {
  // 第四步，使用userService
  constructor(private readonly userService: UserService) {}

  //
  @Get('info')
  getUserByToken(@Req() request) {
    return wrapperResponse(
      this.userService.findByUsername(request.user.username),
      '获取用户信息成功',
    );
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // 用户数据量大的时候需要分页操作
  @Get()
  getAllUser(@Query() query) {
    console.log('query', query);
    return wrapperResponse(this.userService.findAll(query), '获取用户信息成功');
  }

  // 新增用户
  @Post()
  create(@Body() body) {
    return wrapperResponse(this.userService.create(body), '新增用户成功');
  }

  // 更新用户
  @Put()
  update(@Body() body) {
    return wrapperResponse(
      this.userService.update(body),
      '编辑用户信息成功'
    )
  }

  // 删除用户
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return wrapperResponse(
      this.userService.remove(id),
      '删除用户成功'
    )
  }
}
