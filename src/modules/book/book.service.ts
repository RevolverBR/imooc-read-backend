import { Injectable, Param, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Book } from "./book.entity";

@Injectable()
export class BookService {
  constructor (
    @InjectRepository(Book)
    private readonly repository: Repository<Book>
  ) {}


  //
  getBookList(params: any = {}) {
    // 默认获取1页20条数据
    let page = +params.page || 1
    let pageSize = +params.pageSize || 20
    const { title = '', author = ''} = params
    // 兜底
    if (page <= 0) {
      page = 1
    }
    if (pageSize <= 0) {
      pageSize = 20
    }

    let where = 'where 1=1'
    // AND前面有一个空格
    if (title) {
      where += ` AND title LIKE '%${title}%'`
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`
    }

    // offset偏移，limit限制
    const sql = `select * from book ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`
    return this.repository.query(sql)
  }
}