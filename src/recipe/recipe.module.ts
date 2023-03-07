import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entity/recipe';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { User } from "../auth/entity/user";

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [TypeOrmModule.forFeature([Recipe,User])],
  //exports: [TypeOrmModule],
})
export class RecipeModule {}
