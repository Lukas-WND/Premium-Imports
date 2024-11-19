import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
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
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelName: string;

  @Column({ type: 'int' })
  modelYear: number;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
