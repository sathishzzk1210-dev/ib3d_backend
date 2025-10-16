import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { OrderFile } from 'src/modules/orders/entities/order-file.entity';
import { OrderTimeline } from 'src/modules/orders/entities/order-timeline.entity';

export enum OrderStatus {
  PAID = 'paid',
  IN_REVIEW = 'in_review',
  SLICING = 'slicing',
  PRINTING = 'printing',
  POSTPROC = 'postproc',
  QA = 'qa',
  PACKING = 'packing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()   
  id: number;

  @Column({ unique: true })
  externalId: string; // e.g. ORD-2025-001234 from frontend

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.IN_REVIEW })
  status: OrderStatus;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'date', nullable: true })
  estimatedDelivery: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @OneToMany(() => OrderFile, (file) => file.order, { cascade: true, eager: true })
  files: OrderFile[];

  @OneToMany(() => OrderTimeline, (tl) => tl.order, { cascade: true, eager: true })
  timeline: OrderTimeline[];

  // optional: shipping method, tracking, etc
  @Column({ nullable: true })
  shippingMethod: string;

  @Column({ nullable: true })
  trackingNumber: string;


   @Column({ default: false })
  deleted: boolean;
}
