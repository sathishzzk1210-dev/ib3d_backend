import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>
  ) {}

  async findById(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // Remove password if present
    // TypeORM will not include excluded fields by default; ensure you don't leak password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user as any;
    return rest;
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    await this.usersRepo.update({ id }, dto);
    return this.findById(id);
  }

  async listAll() {
    const users = await this.usersRepo.find();
    return users.map(u => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = u as any;
      return rest;
    });
  }

  async changeRole(id: number, dto: ChangeRoleDto) {
    await this.usersRepo.update({ id }, { role: dto.role });
    return this.findById(id);
  }
}
