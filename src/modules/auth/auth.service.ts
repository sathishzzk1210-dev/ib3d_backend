import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from 'src/modules/auth/dto/password-reset.dto';
import { MailUtils } from 'src/core/utils/mailUtils';
import { ResetPasswordDto } from 'src/modules/auth/dto/password-reset.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    // create user object - the entity's @BeforeInsert will hash password if using Encryption util.
    // To be safe, hash password here as well (so entity hook is optional).
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      passwordHash: hashed,
      // role defaults to CUSTOMER in entity
    });

    const saved = await this.usersRepo.save(user);

    // Remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = saved as any;
    return rest;
  }

  async validateUser(email: string, password: string) {
const user = await this.usersRepo.findOne({
  where: { email },
  select: ['id', 'email', 'passwordHash', 'name', 'role'],
});


    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;
    // remove password
    const { passwordHash: p, ...rest } = user as any;
    return rest;
  }

  async login(email: string, password: string) {
const user = await this.usersRepo.findOne({
  where: { email },
  select: ['id', 'email', 'passwordHash', 'name', 'role'],
});

    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = {
  sub: user.id,   // use PK for JWT subject
  role: user.role,
  email: user.email,
  name: user.name,
};

    const access_token = this.jwtService.sign(payload);
  return {
  access_token,
  user: {
    id: user.id,  // compute here instead of selecting from DB
    email: user.email,
    name: user.name,
    role: user.role,
  },
};


  }

 async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email_id } });
    if (!user) throw new NotFoundException('User not found');

    // JWT token valid for 30 minutes
    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '30m' });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await MailUtils.sendPasswordResetEmail(user.email, resetUrl);

    return { message: 'Password reset email sent' };
  }

  // --- Reset Password ---
  async resetPassword(dto: ResetPasswordDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token);
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new NotFoundException('User not found');

    user.passwordHash = await bcrypt.hash(dto.password, 10);
    await this.usersRepo.save(user);

    return { message: 'Password has been reset successfully' };
  }


}
