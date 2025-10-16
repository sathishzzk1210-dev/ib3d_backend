import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_timeline')
export class OrderTimeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Order, (order) => order.timeline, { onDelete: 'CASCADE' })
  order: Order;
}
