import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  // 让自定义module与数据库交互第二步，引入实体
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  // 使用
  providers: [UserService],
  // 导出，让其他模块引用
  exports: [UserService]
})
export class UserModule {}
