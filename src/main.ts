import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 升级到https
// import * as path from 'path';
// import * as fs from 'fs'

// const dir = process.cwd()

// const httpsOptions = {
//   key: fs.readFileSync(path.resolve(dir, './https/httpsDemo.xyz.key')),
//   cert: fs.readFileSync(path.resolve(dir, './https/httpsDemo.xyz.pem'))
// }

async function bootstrap() {
  // { cors: true }允许跨域
  const app = await NestFactory.create(AppModule, { cors: true });
  // https升级
  // const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });

  await app.listen(3000);
}
bootstrap();
