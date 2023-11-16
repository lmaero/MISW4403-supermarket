import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
})
export class CityModule {}
