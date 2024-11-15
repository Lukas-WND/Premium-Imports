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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  saleCode: string;

  @Column({ nullable: false })
  saleDate: Date;

  @Column({ type: 'double', nullable: false })
  entryValue: number;

  @Column({ type: 'double', nullable: true })
  financedAmount: number;

  @Column({ type: 'double', nullable: false })
  totalAmount: number;

  @ManyToOne(() => Client, (client) => client.sales)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Seller, (seller) => seller.sales)
  @JoinColumn({ name: 'seller' })
  seller: Seller;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.sales)
  @JoinColumn({ name: 'vehicle' })
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
