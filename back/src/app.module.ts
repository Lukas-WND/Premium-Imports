import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModule } from './vehicle/vehicle.module';
import { dataSourceOptions } from './database/data-source';
import { ModelModule } from './model/model.module';
import { ClientModule } from './client/client.module';
import { SellerModule } from './seller/seller.module';
import { AutomakerModule } from './automaker/automaker.module';
import { SaleModule } from './sale/sale.module';
import { PurchaseModule } from './purchase/purchase.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    VehicleModule,
    ModelModule,
    ClientModule,
    SellerModule,
    AutomakerModule,
    SaleModule,
    PurchaseModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
