import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Client } from 'src/client/entities/client.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Model } from 'src/model/entities/model.entity';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { ClientService } from 'src/client/client.service';
import { SellerService } from 'src/seller/seller.service';
import { ModelService } from 'src/model/model.service';

@Module({
  controllers: [PurchaseController],
  imports: [
    TypeOrmModule.forFeature([Purchase, Vehicle, Client, Seller, Model]),
  ],
  providers: [
    PurchaseService,
    VehicleService,
    ClientService,
    SellerService,
    ModelService,
  ],
  exports: [PurchaseService],
})
export class PurchaseModule {}
