import { Automaker } from 'src/automaker/entities/automaker.entity';
import { Client } from 'src/client/entities/client.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  'IN_PROCESSING' = 0,
  'CONFIRMED' = 1,
  'SENT' = 2,
  'COMPLETED' = 3,
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  orderCode: string;

  @Column({ nullable: false })
  orderDate: Date;

  @Column({ type: 'double', nullable: false })
  orderValue: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    comment: '0 - IN PROCESSING, 1 - CONFIRMED, 2 - SENT, 3 - COMPLETED',
    default: OrderStatus.IN_PROCESSING,
  })
  status: OrderStatus;

  @Column()
  color: string;

  @Column()
  modelName: string;

  @Column({ type: 'int' })
  modelYear: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Seller, (seller) => seller.orders)
  @JoinColumn({ name: 'seller' })
  seller: Seller;

  @ManyToOne(() => Automaker, (automaker) => automaker)
  @JoinColumn({ name: 'automaker' })
  automaker: Automaker;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
