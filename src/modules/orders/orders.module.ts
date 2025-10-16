import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderFile } from './entities/order-file.entity';
import { OrderTimeline } from './entities/order-timeline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderFile, OrderTimeline])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
