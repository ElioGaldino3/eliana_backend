import { IsNotEmpty} from "class-validator"

export class UpdateClientDto {
  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  name: string
  phone: string
  photoUrl: string
}