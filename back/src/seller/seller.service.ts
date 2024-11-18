import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  /**
   * Cria um novo vendedor na base de dados.
   * @param createSellerDto Dados para criar o vendedor.
   * @returns O vendedor criado.
   */
  async create(createSellerDto: CreateSellerDto) {
    const newSeller = this.sellerRepository.create(createSellerDto);
    return this.sellerRepository.save(newSeller);
  }

  /**
   * Retorna todos os vendedores cadastrados.
   * @returns Lista de vendedores ou uma exceção caso não existam registros.
   */
  async findAll() {
    const sellers = await this.sellerRepository.find();

    if (!sellers.length) {
      throw new NotFoundException('Não foram encontrados registros de vendedores.');
    }

    return sellers;
  }

  /**
   * Busca um vendedor específico pelo ID.
   * @param id ID do vendedor.
   * @returns O vendedor encontrado ou uma exceção.
   */
  async findOne(id: string) {
    const seller = await this.sellerRepository.findOne({ where: { id } });

    if (!seller) {
      throw new NotFoundException(`Vendedor com o ID ${id} não encontrado.`);
    }

    return seller;
  }

  /**
   * Atualiza os dados de um vendedor específico.
   * @param id ID do vendedor a ser atualizado.
   * @param updateSellerDto Dados para atualização.
   * @returns O vendedor atualizado.
   */
  async update(id: string, updateSellerDto: UpdateSellerDto) {
    const seller = await this.findOne(id);

    // Atualiza somente os campos fornecidos.
    this.sellerRepository.merge(seller, updateSellerDto);

    return this.sellerRepository.save(seller);
  }

  /**
   * Remove um vendedor da base de dados via exclusão lógica.
   * @param id ID do vendedor a ser removido.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findOne(id); // Garante que o vendedor existe antes de tentar removê-lo.
    return this.sellerRepository.softDelete(id);
  }
}
