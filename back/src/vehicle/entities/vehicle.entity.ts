  import { Model } from 'src/model/entities/model.entity';
  import { Purchase } from 'src/purchase/entities/purchase.entity';
  import { Sale } from 'src/sale/entities/sale.entity';
  import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity()
  export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    vehicleId: string;

    @Column({ nullable: false, unique: true })
    chassisNumber: string;

    @Column({ nullable: true })
    plate: string;

    @Column({ type: 'int' })
    fabricatingYear: number;

    @Column()
    color: string;

    @Column({ type: 'double' })
    price: number;

    @ManyToOne(() => Model, (model) => model.vehicles)
    @JoinColumn({ name: 'modelId' })
    modelId: Model;

    @OneToMany(() => Purchase, (purchase) => purchase.vehicle)
    purchases: Purchase[];

    @OneToMany(() => Sale, (sale) => sale.vehicle)
    sales: Sale[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
  }
