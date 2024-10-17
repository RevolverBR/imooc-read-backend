import { Entity, PrimaryColumn } from "typeorm";

@Entity('role_auth')
export class RoleAuth {
  @PrimaryColumn()
  roleId: number

  @PrimaryColumn()
  authId: number
}