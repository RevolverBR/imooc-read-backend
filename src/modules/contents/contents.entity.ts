import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('contents')
export class Contents{
  // 每个实体必须至少有一个主键列。这是必须的，你无法避免。要使列成为主键，您需要使用@PrimaryColumn装饰器
  @PrimaryColumn()
  fileName: string

  @Column()
  id: string

  @Column()
  href: string

  @Column()
  order: number

  @Column()
  level: number

  @Column()
  text: string

  @Column()
  label: string

  @Column()
  pid: string

  @PrimaryColumn()
  @Column()
  navId: string
}
