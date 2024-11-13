import { Model } from 'src/model/entities/model.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => Model)
  model: Model;
}
