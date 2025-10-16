import { IsEnum } from 'class-validator';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
