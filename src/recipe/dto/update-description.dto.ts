import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatedescriptionDto {
  @IsNotEmpty()
  @MinLength(10)
  @IsString()
  description: string;
}
