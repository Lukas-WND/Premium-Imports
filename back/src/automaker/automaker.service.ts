import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAutomakerDto } from './dto/create-automaker.dto';
import { UpdateAutomakerDto } from './dto/update-automaker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automaker } from './entities/automaker.entity';

@Injectable()
export class AutomakerService {
  constructor(
    @InjectRepository(Automaker)
    private readonly automakerRepository: Repository<Automaker>,
  ) {}

  /**
   * Cria uma nova montadora na base de dados.
   * @param createAutomakerDto Dados para criar a montadora.
   * @returns A montadora criada.
   */
  async create(createAutomakerDto: CreateAutomakerDto) {
    const newAutomaker = this.automakerRepository.create(createAutomakerDto);
    return this.automakerRepository.save(newAutomaker);
  }

  /**
   * Retorna todas as montadoras cadastradas.
   * @returns Lista de montadoras ou uma exceção caso não existam registros.
   */
  async findAll() {
    const automakers = await this.automakerRepository.find();

    return automakers;
  }

  /**
   * Busca uma montadora específica pelo ID.
   * @param id ID da montadora.
   * @returns A montadora encontrada ou uma exceção.
   */
  async findOne(id: string) {
    const automaker = await this.automakerRepository.findOne({ where: { id } });

    if (!automaker) {
      throw new NotFoundException(`Montadora com o ID ${id} não encontrada.`);
    }

    return automaker;
  }

  /**
   * Atualiza os dados de uma montadora específica.
   * @param id ID da montadora a ser atualizada.
   * @param updateAutomakerDto Dados para atualização.
   * @returns A montadora atualizada.
   */
  async update(id: string, updateAutomakerDto: UpdateAutomakerDto) {
    const automaker = await this.findOne(id);

    // Atualiza somente os campos fornecidos.
    this.automakerRepository.merge(automaker, updateAutomakerDto);

    return this.automakerRepository.save(automaker);
  }

  /**
   * Remove uma montadora da base de dados via exclusão lógica.
   * @param id ID da montadora a ser removida.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findOne(id); // Garante que a montadora existe antes de tentar removê-la.
    return this.automakerRepository.softDelete(id);
  }
}
