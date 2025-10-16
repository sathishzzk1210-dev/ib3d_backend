import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderFile } from './entities/order-file.entity';
import { OrderTimeline } from './entities/order-timeline.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(OrderFile) private readonly fileRepo: Repository<OrderFile>,
    @InjectRepository(OrderTimeline) private readonly timelineRepo: Repository<OrderTimeline>,
  ) {}

  async create(createDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      externalId: createDto.externalId,
      status: createDto.status,
      total: createDto.total,
      currency: createDto.currency ?? 'INR',
      estimatedDelivery: createDto.estimatedDelivery ?? null,
      shippingMethod: createDto.shippingMethod,
      trackingNumber: createDto.trackingNumber,
    });

    if (createDto.items && createDto.items.length) {
      order.items = createDto.items.map(i => this.itemRepo.create({ ...i }));
    }

    if (createDto.files && createDto.files.length) {
      order.files = createDto.files.map(f => this.fileRepo.create({ ...f }));
    }

    if (createDto.timeline && createDto.timeline.length) {
      order.timeline = createDto.timeline.map(t => this.timelineRepo.create({
        date: t.date ? new Date(t.date) : null,
        status: t.status,
        note: t.note,
      }));
    }

    return this.orderRepo.save(order);
  }

  async findAll(filter?: { status?: string; search?: string }): Promise<Order[]> {
    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.files', 'files')
      .leftJoinAndSelect('order.timeline', 'timeline')
      .where('order.deleted = false')
      .orderBy('order.createdAt', 'DESC');

    if (filter?.status) {
      qb.andWhere('order.status = :status', { status: filter.status });
    }

    if (filter?.search) {
      qb.andWhere('(order.externalId ILIKE :s OR files.name ILIKE :s)', { s: `%${filter.search}%` });
    }

    return qb.getMany();
  }

async findOne(id: number): Promise<Order> {
  const order = await this.orderRepo.findOne({ where: { id, deleted: false } });
  if (!order) throw new NotFoundException('Order not found');
  return order;
}

  async update(id: number, updateDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    // simple scalar updates
    if (updateDto.externalId !== undefined) order.externalId = updateDto.externalId;
    if (updateDto.status !== undefined) order.status = updateDto.status;
    if (updateDto.total !== undefined) order.total = updateDto.total;
    if (updateDto.currency !== undefined) order.currency = updateDto.currency;
    if (updateDto.estimatedDelivery !== undefined) order.estimatedDelivery = updateDto.estimatedDelivery;
    if (updateDto.shippingMethod !== undefined) order.shippingMethod = updateDto.shippingMethod;
    if (updateDto.trackingNumber !== undefined) order.trackingNumber = updateDto.trackingNumber;

if (updateDto.items) {
  await this.itemRepo.delete({ order: { id: order.id } } as any);
  order.items = updateDto.items.map(i =>
    this.itemRepo.create({ ...i })
  );
}

if (updateDto.files) {
  await this.fileRepo.delete({ order: { id: order.id } } as any);
  order.files = updateDto.files.map(f =>
    this.fileRepo.create({ ...f })
  );
}

if (updateDto.timeline) {
  await this.timelineRepo.delete({ order: { id: order.id } } as any);
  order.timeline = updateDto.timeline.map(t =>
    this.timelineRepo.create({
      date: t.date ? new Date(t.date) : null,
      status: t.status,
      note: t.note,
    })
  );
}


    return this.orderRepo.save(order);
  }

async remove(id: number): Promise<void> {
  const order = await this.orderRepo.findOne({ where: { id, deleted: false } });
  if (!order) throw new NotFoundException('Order not found');

  order.deleted = true; // mark as deleted
  await this.orderRepo.save(order);
}

}
