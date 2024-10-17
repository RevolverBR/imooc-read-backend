import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { wrapperResponse } from 'src/utils';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 新增role
  @Post()
  create(@Body() body) {
    return wrapperResponse(this.roleService.create(body), 'create success');
  }

  // 修改role
  @Put()
  update(@Body() body) {
    return wrapperResponse(this.roleService.update(body), 'update');
  }

  // 修改role_menu
  @Post('role_menu')
  createRoleMenu(@Body() body) {
    return wrapperResponse(
      this.roleService.createRoleMenu(body),
      'create role_menu success',
    );
  }

  // get role_menu
  @Get('role_menu')
  getRoleMenu(@Query('roleId') roleId: number | string) {
    return wrapperResponse(
      this.roleService.getRoleMenu(roleId),
      'get role_menu success',
    );
  }

  @Delete('role_menu')
  deleteRoleMenu(@Body() roleId: any) {
    return wrapperResponse(
      this.roleService.deleteRoleMenu(roleId),
      'delete rolemenu success'
    )
  }

  // 获取role
  @Get()
  getRole() {
    return wrapperResponse(this.roleService.findAll(), 'getrole');
  }

  // auth
  @Get('auth')
  getAuthList(@Query() query) {
    return wrapperResponse(
      this.roleService.getAuthList(query),
      'get authlist success'
    )
  }

  @Post('auth')
  createAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.createAuth(body),
      'create auth success'
    )
  }

  @Put('auth')
  updateAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.updateAuth(body),
      'update auth success'
    )
  }

  @Delete('auth')
  removeAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.removeAuth(body),
      'delete auth success'
    )
  }

  // role_auth
  @Post('role_auth')
  createRoleAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.createRoleAuth(body),
      'create roleauth success'
    )
  }

  @Delete('role_auth')
  removeRoleAuth(@Body() body) {
    return wrapperResponse(
      this.roleService.removeRoleAuth(body),
      'remove roleauth success'
    )
  }

  @Get('role_auth')
  getRoleAuth(@Query('roleId') roleId: number | string) {
    return wrapperResponse(
      this.roleService.getRoleAuth(roleId),
      'get role_auth success'
    )
  }

  // @Get('role_auth_by_name')
  // getRoleAuthByRoleName(@Query('roleName') roleName: string | number) {
  //   return wrapperResponse(
  //     this.roleService.getRoleAuthByRoleName(roleName),
  //     '获取roleauth成功'
  //   )
  // }
  @Get('role_auth_by_name')
  getRoleAuthByRoleName(@Query('roleName') roleName: string | number) {
    return wrapperResponse(
      this.roleService.getRoleAuthByRoleName(roleName),
      '获取角色和权限绑定关系成功',
    );
  }

}
