// 让实体与mysql数据库形成映射关系，一一对应，由typeorm提供，column让属性成为一个列
import { Entity, Column, Unique, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin_user')
export class User {
  // 自增的column
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // 唯一
  @Unique(['username'])
  @Column()
  username: string;

  @Column()
  password: number;

  @Column()
  avatar: string;

  @Column()
  role: string;

  @Column()
  nickname: string;

  @Column()
  active: number
}