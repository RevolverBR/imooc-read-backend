import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Unique(['key'])
  key: string

  @Column()
  name: string

  @Column()
  remark: string
}