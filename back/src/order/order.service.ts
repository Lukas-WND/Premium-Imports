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
    const { clientId, sellerId, automakerId, ...orderData } = createOrderDto;

    // Obtém o cliente pelo serviço
    const client = await this.clientService.findOne(clientId);
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${clientId} não encontrado.`);
    }

    // Obtém o vendedor pelo serviço
    const seller = await this.sellerService.findOne(sellerId);
    if (!seller) {
      throw new NotFoundException(
        `Vendedor com ID ${sellerId} não encontrado.`,
      );
    }

    // Obtém a montadora pelo serviço
    const automaker = await this.automakerService.findOne(automakerId);
    if (!automaker) {
      throw new NotFoundException(
        `Montadora com ID ${automakerId} não encontrada.`,
      );
    }

    const orderCode: string = `ORD-${Date.now()}`;
    const orderDate: Date = new Date();

    // Cria a entidade Order
    const order = this.orderRepository.create({
      ...orderData,
      orderCode,
      orderDate,
      client,
      seller,
      automaker,
    });

    // Salva o pedido no banco de dados
    return this.orderRepository.save(order);
  }

  // Método para buscar todos os pedidos
  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['client', 'seller', 'automaker'],
    });

    if (!orders.length) {
      throw new NotFoundException('Nenhum pedido encontrado.');
    }

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

    // Atualiza os dados do pedido
    if (status) {
      if (
        status === OrderStatus.COMPLETED &&
        order.status !== OrderStatus.COMPLETED
      ) {
        // Regras ao mudar o status para COMPLETED
        const vehicleData: CreateVehicleDto = {
          chassisNumber: `CHASSIS-${order.id}`, // Gera um número fictício para o chassi
          fabricatingYear: order.modelYear,
          color: order.color,
          price: order.orderValue,
          modelName: order.modelName,
          modelYear: order.modelYear,
        };

        // Chama o VehicleService para criar o veículo
        await this.vehicleService.create(vehicleData);
      }

      order.status = status;
    }

    Object.assign(order, updateData);

    return this.orderRepository.save(order);
  }

  // Método para remover (soft delete) um pedido
  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.softDelete(order.id);
    return { message: `Pedido com ID ${id} removido com sucesso.` };
  }
}
