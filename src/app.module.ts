import { Module } from '@nestjs/common';
// 帮助连接mysql
// npm i --save @nestjs/typeorm typeorm mysql2
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { MenuModule } from './modules/menu/menu.module';
import { ContentsModule } from './modules/contents/contents.module';
import { RoleModule } from './modules/role/role.module';
// import { getMysqlUsernameAndPassword } from './utils';

// 让username，password安全一点
// const { username, password } = getMysqlUsernameAndPassword()

@Module({
  imports: [
    RoleModule,
    UserModule,
    AuthModule,
    BookModule,
    MenuModule,
    ContentsModule,
    // 第一步，全局连接mysql配置
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'vben-book-dev',
      // synchronize不能被用于生产环境，可能会丢失生产环境数据
      // synchronize: true
      // autoLoadEntities指定该选项后，通过 forFeature() 方法注册的每个实体都将自动添加到配置对象的 entities 数组中。
      autoLoadEntities: true,
      // 指示是否应在每次启动应用程序时自动创建数据库架构。请小心使用此选项，不要在生产中使用它，否则您可能会丢失生产数据。此选项在调试和开发期间非常有用。作为替代方案，您可以使用CLI并运行schema:sync命令。
      // 请注意，对于MongoDB数据库，它不会创建模式，因为MongoDB是无模式的。相反，它只是通过创建索引来同步。
      synchronize: false,
      // 打印执行的sql查询语句
      logging: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
