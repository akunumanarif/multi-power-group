import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  internalId: string;

  @Column({ unique: true })
  orderId: string;

  @Column('text', { array: true })
  itemId: string[];

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
