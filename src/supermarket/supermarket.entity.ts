import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity } from '../city/city.entity';

@Entity()
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  webpage: string;

  @ManyToMany(() => CityEntity, (city) => city.supermarkets)
  cities: CityEntity[];
}
