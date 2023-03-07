import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Ingredient, Recipe } from 'src/recipe/entity/recipe';
import { initialSchema1678101163878 } from "../migrations/1678101163878-initial-schema";
import { addUser1678176442196 } from "../migrations/1678176442196-add-user";
import { User } from "../auth/entity/user";

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  logging: configService.get<boolean>('DB_LOGGING'),
  entities: [Recipe, Ingredient,User],
  migrations: [initialSchema1678101163878,addUser1678176442196],
});