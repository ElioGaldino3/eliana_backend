import { Entity, Column, BeforeInsert } from 'typeorm'
import { AbstractEntity } from './abstract.entity'
import * as bcrypt from 'bcryptjs';
import { Exclude, classToPlain } from 'class-transformer';

@Entity()
export class UserEntity extends AbstractEntity {

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string

  @Column({ default: "false" })
  isAuth: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}