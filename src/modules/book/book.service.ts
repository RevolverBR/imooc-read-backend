import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import EpubBook from './epub-book';

// 一个权限列表，负责前端图书内容的展示
const AUTH_LIST = ['BusinessandManagement'];

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
  ) {}

  getBook(id) {
    const sql = `SELECT * FROM book WHERE id = '${id}'`;
    return this.repository.query(sql);
  }

  //
  async getBookList(params: any = {}, userid: number) {
    // 默认获取1页20条数据
    let page = +params.page || 1;
    let pageSize = +params.pageSize || 20;
    const { title = '', author = '' } = params;
    // 兜底
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 20;
    }

    let where = 'where 1=1';
    // AND前面有一个空格
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }

    const categoryAuth = await this.getCategoryTextAuth(userid)

    // 返回对应auth内容的图书
    if (categoryAuth.length > 0) {
      where += ` AND categoryText IN (${categoryAuth.join(',')})`;
    }

    // offset偏移，limit限制
    const sql = `select * from book ${where} limit ${pageSize} offset ${(page - 1) * pageSize}`;
    return this.repository.query(sql);
  }

  async getBookCount(params: any = {}, userid) {
    const { title = '', author = '' } = params;
    const categoryAuth = await this.getCategoryTextAuth(userid)

    let where = 'where 1=1';
    // AND前面有一个空格
    if (title) {
      where += ` AND title LIKE '%${title}%'`;
    }
    if (author) {
      where += ` AND author LIKE '%${author}%'`;
    }
    if (categoryAuth.length > 0) {
      where += ` AND categoryText IN (${categoryAuth.join(',')})`;
    }

    const sql = `select count(*) as count from book ${where}`;

    return this.repository.query(sql);
  }

  uploadBook(file) {
    // console.log(file);
    const destDir = 'D://epub';
    const destPath = path.resolve(destDir, file.originalname);
    fs.writeFileSync(destPath, file.buffer);
    // 电子书解析
    return this.parseBook(destPath, file).then((data) => {
      return {
        filedName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: destPath,
        dir: destDir,
        data,
      };
    });
  }

  /**
   * 解析电子书的方法
   * @param bookPath 图书实际路径
   * @param file file文件
   */
  parseBook(bookPath, file) {
    const epub = new EpubBook(bookPath, file);
    return epub.parse();
  }

  async addBook(params) {
    const {
      fileName,
      cover,
      title,
      author,
      publisher,
      category,
      categoryText,
      language,
      rootFile,
      updateType,
    } = params;
    const insertSql = `INSERT INTO book(
      fileName,
      cover,
      title,
      author,
      publisher,
      bookId,
      category,
      categoryText,
      language,
      rootFile,
      updateType
    ) VALUES(
     '${fileName}',
     '${cover}',
     '${title}',
     '${author}',
     '${publisher}',
     '${fileName}',
     '${category}',
     '${categoryText}',
     '${language}',
     '${rootFile}',
     '${updateType}'
    )`;

    return this.repository.query(insertSql);
  }

  /**
   * 删除电子书的方法
   * @param id 电子书标识id
   */
  deleteBook(id) {
    const deleteSql = `DELETE FROM Book WHERE id = ${id}`;
    return this.repository.query(deleteSql);
  }

  async updateBook(data) {
    const { id, title, author, category, categoryText, publisher, language } =
      data;
    const setSql = [];
    if (title) {
      setSql.push(`title='${title}'`);
    }
    if (author) {
      setSql.push(`author='${author}'`);
    }
    const updateSql = `UPDATE book SET ${setSql.join(',')} WHERE id=${id}`;

    return this.repository.query(updateSql);
  }

  async getCategoryTextAuth(userid) {
    // user
    const userSql = `SELECT * FROM admin_user WHERE id='${userid}'`;
    const userInfo = await this.repository.query(userSql);
    let [{ role }] = userInfo;
    role = JSON.parse(role);
    role = role.map((item) => `'${item}'`);
    const authSql = `SELECT * FROM auth WHERE id IN (
      SELECT DISTINCT authId FROM role_auth WHERE roleId in (
        SELECT id FROM role WHERE \`name\` IN (${role.join(',')})
        )
      )`;
    const authList = await this.repository.query(authSql);
    let categoryAuth = authList.filter((item) => AUTH_LIST.includes(item.key));
    // [ 'BusinessandManagement' ]
    categoryAuth = categoryAuth.map((item) => `'${item.key}'`);
    return categoryAuth
  }
}
