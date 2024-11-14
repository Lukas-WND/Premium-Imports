import { Order } from 'src/order/entities/order.entity';
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
export class Automaker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  cnpj: string;

  @Column({ nullable: false })
  corporateName: string;

  @Column()
  brand: string;

  @Column()
  email: string;

  @Column()
  businessPhone: string;

  @Column()
  cellPhone: string;

  @OneToMany(() => Order, (order) => order.automaker)
  orders: Order[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
