import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn, Entity,
} from "typeorm"

@Entity()
export class Billing extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'real', nullable: false })
  value: string

  @CreateDateColumn()
  created: Date;
}