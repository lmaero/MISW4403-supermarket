import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
