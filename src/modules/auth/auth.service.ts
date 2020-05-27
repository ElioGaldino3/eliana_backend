import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO, RegisterDTO } from './dtos/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepo.create(credentials);

      const haveUser = await this.userRepo.findOne({ username: user.username })
      if (haveUser) {
        throw new ConflictException('Username has already been taken');
      }

      await user.save();

      const payload = { id: user.id, username: user.username, isAuth: user.isAuth }
      const token = this.jwtService.sign(payload)

      return { user: { ...user.toJSON(), token } };
    } catch (err) {
      if (err.response.error === "Conflict") {
        throw new ConflictException('Username has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ username, password }: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { id: user.id, username: user.username, isAuth: user.isAuth }
      const token = this.jwtService.sign(payload)

      return { user: { ...user.toJSON(), token } };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Not found user');
    }

    return user;
  }
}
