import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.save(createProductDto);
    return product;
  }

  async findAll() {
    const product = await this.productRepository.find();
    return [...product];
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    await this.productRepository.delete(id);
    console.log(`Product with id ${id} deleted`);
    return product;
  }
}
