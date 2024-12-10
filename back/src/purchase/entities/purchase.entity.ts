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
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  purchaseCode: string;

  @Column({ nullable: false })
  purchaseDate: Date;

  @Column({ type: 'double', nullable: false })
  purchaseValue: number;

  @ManyToOne(() => Client, (client) => client.purchases)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Seller, (seller) => seller)
  @JoinColumn({ name: 'seller' })
  seller: Seller;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.purchases)
  @JoinColumn({ name: 'vehicle' })
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
