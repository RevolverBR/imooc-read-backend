import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Body,
  Request
} from '@nestjs/common';
import { BookService } from './book.service';
import { wrapperResponse, wrapperCountResponse } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBookList(@Query() params, @Request() request) {
    const { user: { userid } } = request
    return wrapperCountResponse(
      this.bookService.getBookList(params, userid),
      this.bookService.getBookCount(params, userid),
      '获取图书列表成功',
    );
  }

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id) {
    return wrapperResponse(
      this.bookService.getBook(id),
      '查询电子书成功'
    )
  }

  // 14-3 将表单中电子书数据上传到数据库
  @Post()
  insertBook(@Body() body) {
    // console.log(body)
    return wrapperResponse(
      this.bookService.addBook(body),
      '新增电子书成功'
    )
  }

  @Put()
  updateBook(@Body() body) {
    return wrapperResponse(
      this.bookService.updateBook(body),
      '更新电子书成功'
    )
  }

  // 12-5 multer
  // 文件写入
  // ParseFilePipeBuilder文件类型过滤
  // 更新图书
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /epub/,
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return wrapperResponse(
      this.bookService.uploadBook(file),
      '上传图书成功'
    )
  }

  @Delete()
  deleteBook(@Body() body) {
    // 想要使用params里的参数要用Query，不要用Param
    return wrapperResponse(
      this.bookService.deleteBook(body.id),
      `删除id为${body.id}的图书成功`
    )
  }
}
