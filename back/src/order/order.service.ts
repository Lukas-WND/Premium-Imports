import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { ClientService } from 'src/client/client.service';
import { SellerService } from 'src/seller/seller.service';
import { AutomakerService } from 'src/automaker/automaker.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { CreateVehicleDto } from 'src/vehicle/dto/create-vehicle.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly clientService: ClientService,
    private readonly sellerService: SellerService,
    private readonly automakerService: AutomakerService,
    private readonly vehicleService: VehicleService,
  ) {}

  // Método para criar um novo pedido
  async create(createOrderDto: CreateOrderDto) {
    const { client, seller, automaker, ...orderData } = createOrderDto;

    const clientFound = await this.getClient(client);
    const sellerFound = await this.getSeller(seller);
    const automakerFound = await this.getAutomaker(automaker);

    const order = this.orderRepository.create({
      ...orderData,
      orderCode: `ORD-${Date.now()}`,
      orderDate: new Date(),
      client: clientFound,
      seller: sellerFound,
      automaker: automakerFound,
    });

    return this.orderRepository.save(order);
  }

  // Método para buscar todos os pedidos
  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['client', 'seller', 'automaker'],
    });

    return orders;
  }

  // Método para buscar um pedido por ID
  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'seller', 'automaker'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }

    return order;
  }

  // Método para atualizar um pedido
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { status, ...updateData } = updateOrderDto;

    const order = await this.findOne(id);

    // Atualiza o status e cria veículo, se necessário
    if (
      status &&
      status === OrderStatus.COMPLETED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      await this.handleOrderCompletion(order);
    }

    Object.assign(order, { ...updateData, status });
    return this.orderRepository.save(order);
  }

  // Método para remover (soft delete) um pedido
  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.softDelete(order.id);
    return { message: `Pedido com ID ${id} removido com sucesso.` };
  }

  // Método auxiliar para lidar com conclusão de pedido
  private async handleOrderCompletion(order: Order) {
    const vehicleData: CreateVehicleDto = {
      chassisNumber: `CHASSIS-${order.id}`,
      fabricatingYear: order.modelYear,
      color: order.color,
      price: order.orderValue,
      modelName: order.modelName,
      modelYear: order.modelYear,
    };

    await this.vehicleService.create(vehicleData);
  }

  // Métodos auxiliares para validação de entidades relacionadas
  private async getClient(clientId: string) {
    const client = await this.clientService.findOne(clientId);
    if (!client)
      throw new NotFoundException(`Cliente com ID ${clientId} não encontrado.`);
    return client;
  }

  private async getSeller(sellerId: string) {
    const seller = await this.sellerService.findOne(sellerId);
    if (!seller)
      throw new NotFoundException(
        `Vendedor com ID ${sellerId} não encontrado.`,
      );
    return seller;
  }

  private async getAutomaker(automakerId: string) {
    const automaker = await this.automakerService.findOne(automakerId);
    if (!automaker)
      throw new NotFoundException(
        `Montadora com ID ${automakerId} não encontrada.`,
      );
    return automaker;
  }
}
