import { Entity, PrimaryColumn } from "typeorm";

@Entity('role_menu')
export class RoleMenu {
  @PrimaryColumn()
  roleId: number

  @PrimaryColumn()
  menuId: number
}