import { IsNotEmpty } from "class-validator"

export class UpdateProductDto {

  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  value: string

  @IsNotEmpty()
  isRent: string
  
  photoUrl: string
}