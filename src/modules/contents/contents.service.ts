import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contents } from './contents.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Contents)
    private readonly repository: Repository<Contents>,
  ) {}

  deleteContents(params) {
    const { fileName } = params
    const deleteSql = `DELETE FROM contents WHERE fileName = '${fileName}'`
    return this.repository.query(deleteSql)
   }

  addContents(params) {
    const { fileName, navId, href, order, level, text, label, pid, id } = params;
    // order关键词，要包裹一下
    const insertSql = `INSERT INTO contents(
        fileName,
        id,
        href,
        \`order\`,
        level,
        text,
        label,
        pid,
        navId
      ) VALUES(
        '${fileName}',
        '${id}',
        '${href}',
        '${order}',
        '${level}',
        '${text}',
        '${label}',
        '${pid}',
        '${navId}'
      )`;
    return this.repository.query(insertSql);
  }
}
