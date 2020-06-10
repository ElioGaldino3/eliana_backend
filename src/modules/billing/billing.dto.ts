import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBillingDTO {
  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
