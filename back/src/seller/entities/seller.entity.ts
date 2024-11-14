import { Order } from 'src/order/entities/order.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  registration: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Order, (order) => order.seller)
  orders: Order[];

  @OneToMany(() => Purchase, (purchase) => purchase.seller)
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
