import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Cria um novo cliente na base de dados.
   * @param createClientDto Dados para criar o cliente.
   * @returns O cliente criado.
   */
  async create(createClientDto: CreateClientDto) {
    const newClient = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(newClient);
  }

  /**
   * Retorna todos os clientes cadastrados.
   * @returns Lista de clientes ou uma exceção caso não existam registros.
   */
  async findAll() {
    const clients = await this.clientRepository.find();

    if (!clients.length) {
      throw new NotFoundException('Não foram encontrados registros de clientes.');
    }

    return clients;
  }

  /**
   * Busca um cliente específico pelo ID.
   * @param id ID do cliente.
   * @returns O cliente encontrado ou uma exceção.
   */
  async findOne(id: string) {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com o ID ${id} não encontrado.`);
    }

    return client;
  }

  /**
   * Atualiza os dados de um cliente específico.
   * @param id ID do cliente a ser atualizado.
   * @param updateClientDto Dados para atualização.
   * @returns O cliente atualizado.
   */
  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);

    // Atualiza somente os campos fornecidos
    this.clientRepository.merge(client, updateClientDto);

    return this.clientRepository.save(client);
  }

  /**
   * Remove um cliente da base de dados via exclusão lógica.
   * @param id ID do cliente a ser removido.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findOne(id); // Garante que o cliente existe antes de tentar removê-lo.
    return this.clientRepository.softDelete(id);
  }
}
