import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleMenu } from './role-menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleMenu)
    private readonly roleMenuRepository: Repository<RoleMenu>,
  ) {}

  // role
  findAll() {
    const sql = `SELECT id, name, remark FROM role`;
    return this.roleRepository.query(sql);
  }

  create(params) {
    const role = new Role();
    role.name = params.name;
    role.remark = params.remark;

    return this.roleRepository.save(role);
  }

  update(params) {
    const { name, remark } = params;
    const setSql = [];
    if (remark) {
      setSql.push(`remark='${remark}'`);
      const updateSql = `UPDATE role SET ${setSql.join(',')} WHERE name='${name}'`;

      return this.roleRepository.query(updateSql);
    } else {
      return Promise.resolve();
    }
  }

  // role_menu
  getRoleMenu(roleId) {
    const sql = `SELECT roleId, menuId FROM role_menu WHERE roleId='${roleId}'`;
    return this.roleMenuRepository.query(sql);
  }

  async createRoleMenu(params) {
    // const { roleId, menuId } = params
    const roleId = params.roleId;
    const menuId = params.menuId;
    // 对rolemenu进行修改
    const roleMenu = new RoleMenu();
    roleMenu.roleId = roleId;
    roleMenu.menuId = menuId;

    // 让menu role进行交互
    const menuList = await this.roleRepository.query(
      `SELECT * FROM menu WHERE id='${menuId}'`,
    );
    const roleList = await this.roleRepository.query(
      `SELECT * FROM role WHERE id='${roleId}'`,
    );
    const [menu] = menuList || [];
    const [role] = roleList || [];
    if (menu && role) {
      let { meta } = menu;
      meta = JSON.parse(meta);
      // 防止重复添加
      let flag = true;

      if (meta.roles && meta.roles.length > 0) {
        if (!meta.roles.includes(role.name)) {
          const roles = JSON.parse(meta.roles);
          roles.push(role.name);
          meta.roles = JSON.stringify(roles);
          flag = false;
        }
      } else {
        meta.roles = JSON.stringify([role.name]);
      }

      if (flag) {
        // 新增meta里面对应roles没有引号导致页面渲染出现问题，直接处理一下
        meta.roles = meta.roles.replaceAll('"', '\\"');
        meta = JSON.stringify(meta);

        await this.roleRepository.query(
          `UPDATE menu SET meta='${meta}' WHERE id='${menuId}'`,
        );
      }
    }

    return this.roleMenuRepository.save(roleMenu);
  }

  deleteRoleMenu(body) {
    const roleId = body.roleId;
    if (roleId) {
      const sql = `DELETE FROM role_menu WHERE roleId = ${roleId}`;
      return this.roleMenuRepository.query(sql);
    } else {
      return Promise.resolve();
    }
  }

  // auth
  getAuthList(query) {
    const { key } = query;
    // 关键key要用``包裹
    let where = '1=1';
    if (key) {
      // where += ` AND \`key\`='${key}'`
      // 模糊查询
      where += ` AND \`key\` LIKE "%${key}%"`;
    }
    const sql = `SELECT * FROM auth WHERE ${where}`;
    return this.roleRepository.query(sql);
  }

  createAuth(body) {
    const { key = '', name = '', remark = '' } = body;
    const insertSql = `INSERT INTO auth(
      \`key\`,
      name,
      remark
    ) VALUES(
      '${key}',
      '${name}',
      '${remark}'
    )`;

    return this.roleRepository.query(insertSql);
  }

  async updateAuth(body) {
    console.log('body', body)
    const { name, remark, id } = body
    const setSql = []
    if (name || remark) {
      setSql.push(`name='${name}'`);
      setSql.push(`remark='${remark}'`);
      const updateSql = `UPDATE auth SET ${setSql.join(',')} WHERE id='${id}'`;
      console.log('updateSql', updateSql)

      return this.roleRepository.query(updateSql)
    } else {
      return Promise.resolve({})
    }
  }

  removeAuth(body) {
    const authId = body.authId
    if (authId) {
      const sql = `DELETE FROM auth WHERE id='${authId}'`
      return this.roleRepository.query(sql)
    } else {
      return Promise.resolve()
    }
  }

  // role_auth
  createRoleAuth(body) {
    const { roleId, authId } = body
    const insertSql = `INSERT INTO role_auth(
      roleId,
      authId
    ) VALUES(
      '${roleId}',
      '${authId}'
    )`

    return this.roleRepository.query(insertSql)
  }

  removeRoleAuth(body) {
    const roleId = body.roleId
    const authId = body.authId
    if (roleId) {
      const sql = `DELETE FROM role_auth WHERE roleId='${roleId}'`
      return this.roleRepository.query(sql)
    } else if (authId) {
      const sql = `DELETE FROM role_auth WHERE authId='${authId}'`
      return this.roleRepository.query(sql)
    } else {
      return Promise.resolve()
    }
  }

  getRoleAuth(roleId) {
    const sql = `SELECT authId FROM role_auth WHERE roleId='${roleId}'`

    return this.roleRepository.query(sql)
  }

  async getRoleAuthByRoleName(roleName) {
    // 根据user role names拿到相应auths
    roleName = JSON.parse(roleName)
    roleName = roleName.map(role => `'${role}'`)
    const where = `WHERE 1=1 AND name IN (${roleName.join(',')})`
    const sql = `SELECT id, name FROM role ${where}`
    const roleList = await this.roleRepository.query(sql)
    const roleIdlist = roleList.map(role => role.id)

    const authWhere = `WHERE 1=1 AND roleId IN (${roleIdlist.join(',')})`
    const authSql = `SELECT authId, roleId FROM role_auth ${authWhere}`
    const authList = await this.roleRepository.query(authSql)

    // 同一角色不同身份权限可能重复，要对authId进行去重
    let authIds = authList.map(item => item.authId)

    const authSet = new Set()
    authIds.forEach((item) => {
      authSet.add(item)
    })
    authIds = Array.from(authSet)

    // 权限为空时，返回一个空数组
    if (authIds.length === 0) {
      return authIds
    } else {
      const authListSql = `SELECT * FROM auth WHERE 1=1 AND id IN (${authIds.join(',')})`
      const authInfo = await this.roleRepository.query(authListSql)
      return authInfo
    }

  }
}
