import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_files')
export class OrderFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  size: string;

  @ManyToOne(() => Order, (order) => order.files, { onDelete: 'CASCADE' })
  order: Order;
}
