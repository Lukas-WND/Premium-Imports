import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Automaker } from 'src/automaker/entities/automaker.entity';
import { ClientService } from 'src/client/client.service';
import { SellerService } from 'src/seller/seller.service';
import { AutomakerService } from 'src/automaker/automaker.service';
import { Order } from './entities/order.entity';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ModelService } from 'src/model/model.service';
import { Model } from 'src/model/entities/model.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ClientService, SellerService, AutomakerService, VehicleService, ModelService],
  imports: [
    TypeOrmModule.forFeature([Order, Client, Seller, Automaker, Vehicle, Model]),
  ],
  exports: [OrderService],
})
export class OrderModule {}
