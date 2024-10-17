import { Module } from "@nestjs/common";
import { contentsController } from "./contents.controller";
import { ContentsService } from "./contents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contents } from "./contents.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contents])],
  controllers: [contentsController],
  providers: [ContentsService]
})

export class ContentsModule{}