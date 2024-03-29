import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RecipeDto } from "./dto/recipe.dto";
import { Recipe } from "./entity/recipe";
import { User } from "../auth/entity/user";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
  }

  async getRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  async getRecipe(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new HttpException("No entity found", HttpStatus.NOT_FOUND);
    }
    return recipe;
  }

  async createRecipe(recipeDto: RecipeDto, userEmail: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { email: userEmail }
    });
    await this.recipeRepository.save({ ...recipeDto, user });
  }

  async updateDescription(id: string, description: string, userEmail: string): Promise<void> {
    const recipe = await this.recipeRepository.findOneOrFail({
      where: { id },
      relations: ["user"]
    });

    if (recipe.user.email !== userEmail) {
      throw new HttpException("You cannot update recipe. It's  not yours!", 403);
    }
    await this.recipeRepository.update({ id }, { description });
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.recipeRepository.delete({ id });
  }

  async addFileToRecipe(file: Express.Multer.File, id: string, email: string) {
    const recipe = await this.recipeRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });

    if (recipe.user.email !== email) {
      throw new HttpException("You cannot update recipe. It's  not yours!", 400,
      );
    }

    const bucketKey = `${file.fieldname}${Date.now()}`;
    // const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
    const fileUrl = `${file.originalname}-${Date.now()}`;
    await this.recipeRepository.update({ id }, { image: fileUrl });
  }



}
