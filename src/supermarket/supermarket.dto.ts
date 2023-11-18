import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SupermarketDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly longitude: string;

  @IsString()
  @IsNotEmpty()
  readonly latitude: string;

  @IsUrl()
  @IsNotEmpty()
  readonly webpage: string;
}
