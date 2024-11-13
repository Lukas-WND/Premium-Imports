import { Model } from 'src/model/entities/model.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Model)
  @JoinColumn()
  model: Model;
}
