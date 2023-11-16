import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';

describe('CityService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
