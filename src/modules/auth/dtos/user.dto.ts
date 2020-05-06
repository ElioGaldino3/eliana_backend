import { IsString, MinLength} from 'class-validator';

export class LoginDTO {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {}

export interface AuthPayload {
  username: string 
}