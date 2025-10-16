// src/modules/location/location.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [HttpModule],
  controllers: [LocationController],
  providers: [LocationService],
    exports: [LocationService],
  
})
export class LocationModule {}
