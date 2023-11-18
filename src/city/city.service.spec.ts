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
});
