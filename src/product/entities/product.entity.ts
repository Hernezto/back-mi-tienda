import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    default: [''],
  })
  imag: string;

  @Column('decimal')
  price: number;

  @Column('text')
  description: string;

  @Column('text')
  type: string;

  @Column('bool', {
    default: true,
  })
  inStock: boolean;
}
