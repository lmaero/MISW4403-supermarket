import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { faker } from '@faker-js/faker';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cityList: CityEntity[] = [];

  const seedDatabase = async () => {
    await repository.clear();
    cityList = [];

    for (let i = 0; i < 5; i++) {
      const city: CityEntity = await repository.save({
        name: faker.location.city(),
        country: faker.location.country(),
        population: faker.number.int(),
      });

      cityList.push(city);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );

    await seedDatabase();
  });

  it('findAll should return all cities', async () => {
    const cities: CityEntity[] = await service.findAll();

    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(cityList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CityEntity = cityList[0];
    const city: CityEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should return a new city if country is valid', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'Argentina',
      population: faker.number.int(),
      supermarkets: [],
    };

    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity: CityEntity = await repository.findOne({
      where: { id: newCity.id },
    });

    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
    expect(storedCity.country).toEqual(newCity.country);
    expect(storedCity.population).toEqual(newCity.population);
  });

  it('create should throw an exception for a city with an invalid country', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'Colombia',
      population: faker.number.int(),
      supermarkets: [],
    };

    await expect(() => service.create(city)).rejects.toHaveProperty(
      'message',
      'That is not a valid country',
    );
  });
});
