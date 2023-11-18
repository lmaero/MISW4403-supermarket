import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateSupermarket } from '../supermarket/supermarket.service.spec';
import { generateCity } from '../city/city.service.spec';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;
  let city: CityEntity;
  let supermarketList: SupermarketEntity[];

  async function seedDatabase() {
    await cityRepository.clear();
    await supermarketRepository.clear();
    supermarketList = [];

    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await supermarketRepository.save(
        generateSupermarket(),
      );
      supermarketList.push(supermarket);
    }

    city = await cityRepository.save({
      ...generateCity(),
      supermarkets: supermarketList,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    supermarketRepository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save(
      generateSupermarket(),
    );
    const newCity: CityEntity = await cityRepository.save(generateCity());

    const result: CityEntity = await service.addSupermarketToCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name);
    expect(result.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(result.supermarkets[0].longitude).toBe(newSupermarket.longitude);
    expect(result.supermarkets[0].webpage).toBe(newSupermarket.webpage);
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save(generateCity());

    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save(
      generateSupermarket(),
    );

    await expect(() =>
      service.addSupermarketToCity('0', newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketsFromCity should return supermarkets by city', async () => {
    const supermarkets: SupermarketEntity[] =
      await service.findSupermarketsFromCity(city.id);
    expect(supermarkets.length).toBe(supermarketList.length);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketFromCity('0', generateCity().id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
