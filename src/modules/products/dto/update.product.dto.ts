import { IsNotEmpty } from "class-validator"

export class UpdateProductDto {
  @IsNotEmpty()
  name?: string

  @IsNotEmpty()
  value?: string

  isRent?: boolean
  
  photoUrl?: string
}