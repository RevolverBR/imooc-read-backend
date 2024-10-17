import { Controller, Get, Query, Post, Param, Body, Delete } from "@nestjs/common";
import { wrapperResponse } from "src/utils";
import { ContentsService } from "./contents.service";

@Controller('contents')
export class contentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  addContents(@Body() body) {
    console.log('params', body)
    return wrapperResponse(
      this.contentsService.addContents(body),
      '添加电子书目录成功'
    )
  }

  @Delete()
  deleteContents(@Body() body) {
    return wrapperResponse(
      this.contentsService.deleteContents(body),
      '删除电子书目录成功'
    )
  }
}