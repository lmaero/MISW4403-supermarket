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

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      name: '1234567890',
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      webpage: faker.internet.url(),
      cities: [],
    };

    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({
      where: { id: newSupermarket.id },
    });

    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
    expect(storedSupermarket.latitude).toEqual(newSupermarket.latitude);
    expect(storedSupermarket.longitude).toEqual(newSupermarket.longitude);
    expect(storedSupermarket.webpage).toEqual(newSupermarket.webpage);
  });

  it('create should throw an exception for a supermarket with a short name', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      name: 'Short',
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      webpage: faker.internet.url(),
      cities: [],
    };

    await expect(() => service.create(supermarket)).rejects.toHaveProperty(
      'message',
      'Supermarket name should be at least 10 characters long',
    );
  });

  it('update should modify a supermarket if has a valid name', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name = 'More than 10 characters name';

    const updatedSupermarket: SupermarketEntity = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updatedSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermarketEntity = supermarketList[0];
    supermarket = {
      ...supermarket,
      name: 'New valid name',
    };
    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('update should throw if the supermarket name is less that 10 chars long', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name = '1';

    await expect(() =>
      service.update(supermarket.id, supermarket),
    ).rejects.toHaveProperty(
      'message',
      'Supermarket name should be at least 10 characters long',
    );
  });
});
