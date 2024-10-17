import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { RoleController } from './role.controller';
import { RoleMenu } from './role-menu.entity';
import { RoleAuth } from './role-auth.entity';
import { Auth } from './auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenu, Auth, RoleAuth])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
