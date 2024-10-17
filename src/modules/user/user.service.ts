import { InjectRepository} from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository } from "typeorm";
import { User } from  './user.entity'
import { createUserDto } from "./create-user.dto";

@Injectable()
export class UserService {
  constructor(
    // 第三步
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({id})
  }

  findAll(params): Promise<User[]> {
    // 默认条件
    let where = 'WHERE 1=1'
    // 查询匹配id项
    if (params.id) {
      where += ` AND id='${params.id}'`
    }
    // 查询匹配username项
    if (params.username) {
      where += ` AND username='${params.username}'`
    }
    // 查询匹配active项
    if (params.active) {
      where += ` AND active='${params.active}'`
    }
    // 分页处理
    let page = +params.page || 1
    let pageSize = +params.pageSize || 20
    if (page <= 0) page = 1
    if (pageSize <= 0) pageSize = 20

    // 定义sql
    let sql = `SELECT id, username, avatar, role, nickname, active FROM admin_user ${where} limit ${pageSize} offset ${(page-1) * pageSize}`

    return this.userRepository.query(sql)
  }

  // 新建用户
  create(createUserDto: createUserDto): Promise<User> {
    const user = new User()
    user.username = createUserDto.username
    user.password = createUserDto.password
    user.role = createUserDto.role
    user.nickname = createUserDto.nickname || createUserDto.username
    user.avatar = createUserDto.avatar
    user.active = 1

    return this.userRepository.save(user)
  }

  // update
  update(params) {
    console.log('params', params)
    const { username, nickname, active, role } = params
    const setSql = []
    if (nickname) setSql.push(`nickname='${nickname}'`)
    if (active) setSql.push(`active='${active}'`)
    if (role) setSql.push(`role='${role}'`)
    const updateSql = `UPDATE admin_user SET ${setSql.join(',')} WHERE username='${username}'`

    return this.userRepository.query(updateSql)
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id)
  }

  // 根据用户名查询用户
  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username })
  }
}