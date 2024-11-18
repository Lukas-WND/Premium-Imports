import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Client } from 'src/client/entities/client.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Model } from 'src/model/entities/model.entity';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { ClientService } from 'src/client/client.service';
import { SellerService } from 'src/seller/seller.service';
import { ModelService } from 'src/model/model.service';

@Module({
  controllers: [SaleController],
  imports: [TypeOrmModule.forFeature([Sale, Vehicle, Client, Seller, Model])],
  providers: [
    SaleService,
    VehicleService,
    ClientService,
    SellerService,
    ModelService,
  ],
  exports: [SaleService]
})
export class SaleModule {}
