import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  SUPPORT = 'SUPPORT', // based on PRD
}

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id!: number;   // plain numeric primary key

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phone?: string;

  @Exclude()
  @Column({ type: 'varchar', select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
