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

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  create(createUserDto: createUserDto): Promise<User> {
    const user = new User()
    user.username = createUserDto.username
    user.password = createUserDto.password
    user.role = createUserDto.role
    user.nickname = createUserDto.nickname
    user.avatar = createUserDto.avatar
    user.active = 1

    return this.userRepository.save(user)
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id)
  }

  // 根据用户名查询用户
  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username })
  }
}