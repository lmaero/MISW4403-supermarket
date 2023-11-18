import { Controller, UseInterceptors } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketController {
  constructor(private readonly supermarketService: SupermarketService) {}
}
