import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

function verifySupermarketName(supermarket: SupermarketEntity) {
  if (supermarket.name.length <= 10) {
    throw new BusinessLogicException(
      'Supermarket name should be at least 10 characters long',
      BusinessError.PRECONDITION_FAILED,
    );
  }
}

@Injectable()
export class SupermarketService {
  constructor(
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find({ relations: ['cities'] });
  }

  async findOne(id: string): Promise<SupermarketEntity> {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
        relations: ['cities'],
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return supermarket;
  }

  async create(supermarket: SupermarketEntity): Promise<SupermarketEntity> {
    verifySupermarketName(supermarket);
    return await this.supermarketRepository.save(supermarket);
  }

  async update(
    id: string,
    supermarket: SupermarketEntity,
  ): Promise<SupermarketEntity> {
    const persistedSupermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
      });
    if (!persistedSupermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    verifySupermarketName(supermarket);
    return await this.supermarketRepository.save({
      ...persistedSupermarket,
      ...supermarket,
    });
  }

  async delete(id: string) {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.supermarketRepository.remove(supermarket);
  }
}
