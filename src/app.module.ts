import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';

@Module({
  imports: [CityModule, SupermarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
