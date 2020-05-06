import { Controller, ValidationPipe, Body, Post, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post()
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials);
  }

  @Get("/:id")
  @UseGuards(AuthGuard())
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUser(id)
  }
}
