import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe, Request, UseGuards, UseInterceptors, UploadedFile
} from "@nestjs/common";
import { RecipeDto } from "./dto/recipe.dto";
import { UpdatedescriptionDto } from "./dto/update-description.dto";
import { RecipeService } from "./recipe.service";
import { AccessTokenGuard } from "../auth/guard/access-token.guard";
import { Role } from "../auth/decorators/role";
import { UserRole } from "../auth/entity/user";
import { RoleGuard } from "../auth/guard/authorization.guard";
import { Express } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("recipe")
export class RecipeController {
  constructor(private recipeService: RecipeService) {
  }

  @Get()
  async getRecipes() {
    //throw new Error("Test Error 123")
    return await this.recipeService.getRecipes();
  }

  @Get("/:id")
  async getRecipe(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.recipeService.getRecipe(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async createRecipe(@Body() recipeDto: RecipeDto, @Request() req) {
    const { sub } = req.user;
    return await this.recipeService.createRecipe(recipeDto, sub);
  }

  @UseGuards(AccessTokenGuard)
  @Patch("/:id")
  async updateDescription(
    @Body() { description }: UpdatedescriptionDto,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Request() req
  ) {
    const { sub } = req.user;
    return await this.recipeService.updateDescription(id, description, sub);
  }


  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete("/:id")
  async deleteRecipe(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.recipeService.deleteRecipe(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload-file')
  async addImageToRecipe(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req,
  ) {
    //console.log(file);
    const { sub: email } = req.user;
    await this.recipeService.addFileToRecipe(file, id, email);
  }
}
