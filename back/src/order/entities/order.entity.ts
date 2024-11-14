import { Automaker } from 'src/automaker/entities/automaker.entity';
import { Client } from 'src/client/entities/client.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Seller, (seller) => seller.orders)
  @JoinColumn({ name: 'seller' })
  seller: Seller;

  @ManyToOne(() => Automaker, (automaker) => automaker)
  @JoinColumn({ name: 'automaker' })
  automaker: Automaker;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.order)
  @JoinColumn({ name: 'vehicle' })
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
