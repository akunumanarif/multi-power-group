import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'notifications_processed' })
@Unique(['orderId', 'itemId'])
export class NotificationProcessed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  itemId: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  processedAt: Date;
}
