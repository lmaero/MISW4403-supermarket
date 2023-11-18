import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';
import { faker } from '@faker-js/faker';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let supermarketList: SupermarketEntity[] = [];

  const seedDatabase = async () => {
    await repository.clear();
    supermarketList = [];

    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await repository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        webpage: faker.internet.url(),
      });

      supermarketList.push(supermarket);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );

    await seedDatabase();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();

    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketList[0];
    const supermarket: SupermarketEntity = await service.findOne(
      storedSupermarket.id,
    );
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
