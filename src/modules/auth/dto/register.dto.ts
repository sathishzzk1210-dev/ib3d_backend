import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1-202-555-0187',
    description: 'Phone number of the user (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password with minimum 6 characters',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
