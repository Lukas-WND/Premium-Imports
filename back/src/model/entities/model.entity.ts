import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelName: string;

  @Column({ type: 'int' })
  modelYear: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
