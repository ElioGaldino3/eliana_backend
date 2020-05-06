import { IsString, IsNotEmpty } from "class-validator"

export class CreateClientDto{

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  phone: string

  @IsString()
  photoUrl: string
}