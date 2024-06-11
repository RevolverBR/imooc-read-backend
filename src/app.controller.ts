// Params：restfulAPI参数
// Query：url参数
// Body：Post参数
import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpException, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';
import { HttpExceptionFilter } from './exception/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  // 获取参数，可以多个/:id/:subId，使用params.获取
  @Get('/data/:id')
  @UseFilters(new HttpExceptionFilter())
  getData(@Param() params):string {
    // console.log(params)
    return 'data' + params.id
  }

  @Get('/data')
  @UseFilters(new HttpExceptionFilter())
  getAllData():string {
    return 'all data'
  }

  @Post('/data')
  @UseFilters(new HttpExceptionFilter())
  addData(@Body() body, @Query() query) {
    // console.log(body)
    // console.log(query)
    return 'add data:' + JSON.stringify(body) + 'id:' + query.id
  }

  @Put('/data')
  @UseFilters(new HttpExceptionFilter())
  updateData(@Body() body) {
    return 'updata data:' + JSON.stringify(body)
  }

  @Delete('/data/:id')
  @UseFilters(new HttpExceptionFilter())
  deleteData(@Param() params) {
    return 'delete data:' + params.id
  }
}
