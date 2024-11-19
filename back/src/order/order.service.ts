import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {}

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['client', 'seller', 'automaker'],
    });

    if (!orders.length)
      throw new NotFoundException('Nenhum pedido encontrado.');

    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'seller', 'automaker'],
    });

    if (!order)
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {}

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.softDelete(order.id);
    return { message: `Pedido com ID ${id} removido com sucesso.` };
  }
}
