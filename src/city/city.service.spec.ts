import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { faker } from '@faker-js/faker';

export function generateCity(): CityEntity {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.location.city(),
    country: faker.location.country(),
    population: faker.number.int(),
    supermarkets: [],
  };
}

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cityList: CityEntity[] = [];

  const seedDatabase = async () => {
    await repository.clear();
    cityList = [];

    for (let i = 0; i < 5; i++) {
      const city: CityEntity = await repository.save(generateCity());
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
      ...generateCity(),
      country: 'Argentina',
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
      ...generateCity(),
      country: 'Colombia',
    };

    await expect(() => service.create(city)).rejects.toHaveProperty(
      'message',
      'That is not a valid country',
    );
  });

  it('update should modify a city if country is valid', async () => {
    const city: CityEntity = cityList[0];
    city.name = 'Sheridan';
    city.country = 'Ecuador';

    const updatedCity: CityEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();

    const storedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
    expect(storedCity.country).toEqual(city.country);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CityEntity = cityList[0];
    city = {
      ...city,
      country: 'Paraguay',
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('update should throw if the country is not valid', async () => {
    const city: CityEntity = cityList[0];
    city.name = 'Sheridan';
    city.country = 'USA';

    await expect(() => service.update(city.id, city)).rejects.toHaveProperty(
      'message',
      'That is not a valid country',
    );
  });

  it('delete should remove a city', async () => {
    const city: CityEntity = cityList[0];
    await service.delete(city.id);
    const deletedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
