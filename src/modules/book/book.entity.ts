import { Column, Entity, Unique, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  // 文件名
  @Column()
  @Unique(['filename'])
  filename: string

  // 封面
  @Column()
  cover: string

  // 书名
  @Column()
  title: string

  // 作者
  @Column()
  author: string

  // 出版社
  @Column()
  publisher: string

  // bookid
  @Column()
  bookId: string

  //
  @Column()
  category: number

  //
  @Column()
  categoryText: string

  // 语种
  @Column()
  language: string

  //
  @Column()
  rootFile: string
}