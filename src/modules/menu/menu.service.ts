import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MENU_LIST } from './menu.data';
import { Menu } from './menu.entity';

// 9-4sql查询
// const QUERY_ALL_SQL = 'select * from menu where active = 0 order by id asc'
// id 倒序
// const QUERY_ALL_SQL = 'select * from menu where active = 1 order by id desc'
// id 正序
// const QUERY_ALL_SQL = 'select * from menu where active = 1 order by id asc'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>
  )
  {}

  findAll() {
    //9-4引入menuRepository后就可以从数据库中获取数据,使用sql查询
    const sql = 'select * from menu order by id asc'
    return this,this.menuRepository.query(sql)

    // return this.menuRepository.findBy({ active: 1 })
    // return new Promise((resolve) => {
    //   resolve(MENU_LIST);
    // });
  }

  // 9-5 查找激活的路由,通过active筛选,id排序
  findActive() {
    const sql = 'select * from menu where active = 1 order by id asc'
    return this,this.menuRepository.query(sql)
  }
}
