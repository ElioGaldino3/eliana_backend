import { IsString, IsNumber } from "class-validator";

export class CreateBillingDTO {
  @IsString()
  content: string;

  @IsNumber()
  value: number;
}