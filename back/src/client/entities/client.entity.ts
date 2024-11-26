import { Order } from 'src/order/entities/order.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Sale } from 'src/sale/entities/sale.entity';
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
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @Column({nullable: false})
  name: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ length: 11, nullable: true })
  homePhone: string;

  @Column({ length: 11 })
  cellPhone: string;

  @Column({ type: 'double', nullable: false })
  income: number;

  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];

  @OneToMany(() => Purchase, (purchase) => purchase.client)
  purchases: Purchase[];

  @OneToMany(() => Sale, (sale) => sale.client)
  sales: Sale[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
