import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { SellerService } from '../seller/seller.service';
import { ClientService } from '../client/client.service';
import { AutomakerService } from '../automaker/automaker.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vehicleService: VehicleService,
    private readonly sellerService: SellerService,
    private readonly clientService: ClientService,
    private readonly automakerService: AutomakerService,
  ) {}

  /**
   * Criação de um novo pedido
   */
  async create(createOrderDto: CreateOrderDto) {
    const { clientId, sellerId, automakerId, orderValue, modelId, modelName, modelYear } =
      createOrderDto;

    // Verificação de cliente, vendedor e montadora
    const client = await this.clientService.findOne(clientId);
    if (!client) throw new NotFoundException(`Cliente com ID ${clientId} não encontrado.`);

    const seller = await this.sellerService.findOne(sellerId);
    if (!seller) throw new NotFoundException(`Vendedor com ID ${sellerId} não encontrado.`);

    const automaker = await this.automakerService.findOne(automakerId);
    if (!automaker) throw new NotFoundException(`Montadora com ID ${automakerId} não encontrada.`);

    // Geração de código único para o pedido
    const orderCode = `ORD-${Date.now()}`;

    // Criação do pedido
    const newOrder = this.orderRepository.create({
      orderCode,
      orderDate: new Date(),
      orderValue,
      client,
      seller,
      automaker,
      status: OrderStatus.IN_PROCESSING,
    });

    return this.orderRepository.save(newOrder);
  }

  /**
   * Listar todos os pedidos
   */
  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['client', 'seller', 'automaker', 'vehicle'],
    });

    if (!orders.length) throw new NotFoundException('Nenhum pedido encontrado.');

    return orders;
  }

  /**
   * Buscar um pedido pelo ID
   */
  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'seller', 'automaker', 'vehicle'],
    });

    if (!order) throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);

    return order;
  }

  /**
   * Atualizar um pedido
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    // Atualização do status
    if (updateOrderDto.status === OrderStatus.COMPLETED && !order.vehicle) {
      // Verificação de dados para criação do veículo
      if (!updateOrderDto.modelId || !updateOrderDto.modelName || !updateOrderDto.modelYear) {
        throw new BadRequestException(
          'Informações do veículo incompletas para finalizar o pedido.',
        );
      }

      // Criação do veículo
      // const vehicle = await this.vehicleService.create({
      //   modelId: updateOrderDto.modelId,
      //   modelName: updateOrderDto.modelName,
      //   modelYear: updateOrderDto.modelYear,
      // });

      // order.vehicle = vehicle;
    }

    // Atualiza os outros campos
    Object.assign(order, updateOrderDto);

    return this.orderRepository.save(order);
  }

  /**
   * Remover um pedido (soft delete)
   */
  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.softDelete(order.id);
    return { message: `Pedido com ID ${id} removido com sucesso.` };
  }
}
