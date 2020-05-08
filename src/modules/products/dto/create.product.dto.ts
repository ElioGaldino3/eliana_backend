import { IsNotEmpty } from "class-validator"

export class CreateProductDto {

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  value: string

  @IsNotEmpty()
  isRent: string
  
  photoUrl: string
}