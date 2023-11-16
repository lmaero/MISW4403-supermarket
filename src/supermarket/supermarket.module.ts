import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  providers: [SupermarketService],
})
export class SupermarketModule {}
