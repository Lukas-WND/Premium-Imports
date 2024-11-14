import { Model } from 'src/model/entities/model.entity';
import { Order } from 'src/order/entities/order.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  chassisNumber: string;

  @Column()
  plate: string;

  @Column({ type: 'int' })
  fabricatingYear: number;

  @Column()
  color: string;

  @Column({ type: 'double' })
  price: number;

  @OneToOne(() => Model, (model) => model.vehicle)
  @JoinColumn({ name: 'model' })
  model: Model;

  @OneToOne(() => Order, (order) => order.vehicle)
  order: Order;

  @OneToMany(() => Purchase, (purchase) => purchase.vehicle)
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
