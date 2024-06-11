import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
// 帮助连结mysql
import { TypeOrmModule } from '@nestjs/typeorm';
// import { getMysqlUsernameAndPassword } from './utils';

// 让username，password安全一点
// const { username, password } = getMysqlUsernameAndPassword()

@Module({
  imports: [
    UserModule,
    AuthModule,
    BookModule,
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
      autoLoadEntities: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
