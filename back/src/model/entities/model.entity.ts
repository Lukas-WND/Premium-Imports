import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelName: string;

  @Column({ type: 'int' })
  modelYear: number;
}
