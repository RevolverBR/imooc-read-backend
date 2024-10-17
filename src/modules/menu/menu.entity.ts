// 在mysql里面建表
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // 可能重复不适用unique
  // @Unique(['path'])
  path: string;

  @Column()
  @Unique(['name'])
  name: string;

  @Column({default: ''})
  redirect: string;

  @Column()
  meta: string;

  @Column()
  // parentid
  pid: number;

  // 1可用，0不可用
  @Column({default: 1})
  active: number;
}