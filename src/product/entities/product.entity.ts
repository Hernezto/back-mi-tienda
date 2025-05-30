import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'bytea', nullable: true })
  image: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column({ default: true, nullable: true })
  inStock: boolean;
}
