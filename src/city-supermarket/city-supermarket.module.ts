import { Module } from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity]),
    TypeOrmModule.forFeature([SupermarketEntity]),
  ],
  providers: [CitySupermarketService],
})
export class CitySupermarketModule {}
