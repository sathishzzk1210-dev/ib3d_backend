// profile.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import  User  from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async getProfile(userId: number) {
  //   return this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['team'], // join with team_member_list
  //   });
  // }
}
