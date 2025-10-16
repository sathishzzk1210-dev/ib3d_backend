import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
}
