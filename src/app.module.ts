import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/env.validation';
import { Ingredient, Recipe } from './recipe/entity/recipe';
import { RecipeModule } from './recipe/recipe.module';
import { AuthModule } from "./auth/auth.module";
import { User } from "./auth/entity/user";
import { AppController } from "./app.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Recipe, Ingredient, User],
        synchronize: false,//configService.get<boolean>('DB_SYNCHRONIZATION'),
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    //MulterModule.register({ dest: './uploads' }),
    RecipeModule,AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
