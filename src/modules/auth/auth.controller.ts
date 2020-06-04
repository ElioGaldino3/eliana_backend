import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: any): Promise<UserEntity> {
    return this.authService.getUser(req.user.id);
  }
}
