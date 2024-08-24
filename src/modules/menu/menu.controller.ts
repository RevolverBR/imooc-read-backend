import { Body, Controller, Get, Post, Put, Param, ParseIntPipe, Req } from '@nestjs/common';
import { MenuService } from './menu.service'
import { wrapperResponse } from 'src/utils';
// import { wrapperResponse } from 'src/utils';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // 获取active menu
  @Get('active')
  getActiveMenu() {
    return wrapperResponse(
      this.menuService.findActive(), "获取用户信息成功"
    )
  }

  // @Get(':id')
  // getMenu(@Param('id', ParseIntPipe) id: number) {
  //   return this.menuService.findOne(id)
  // }

  // 用户数据量大的时候需要分页操作
  @Get()
  getAllMenu() {
    return wrapperResponse(
      this.menuService.findAll(), "获取用户信息成功"
    )
  }

  // 10-2
  @Post()
  create(@Body() body) {
    return wrapperResponse(
      this.menuService.create(body), "菜单创建成功"
    )
  }

  // 10-3
  @Put()
  update(@Body() body) {
    return wrapperResponse(
      this.menuService.update(body), "菜单更新成功"
    )
  }
}
