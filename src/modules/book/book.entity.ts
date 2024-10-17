import { Column, Entity, Unique, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
export class Book {
  // 假设你希望 id 列自动生成（这称为 auto-increment/sequence/serial/generated identity column）。为此你需要将@PrimaryColumn装饰器更改为@PrimaryGeneratedColumn装饰器：
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