import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private convertImageToBase64(imagePath: string | null): string {
    if (!imagePath || typeof imagePath !== 'string') {
      return ''; // Retorna una cadena vacía si el valor no es válido
    }
    const fullPath = path.join(__dirname, '../../uploads', imagePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, { encoding: 'base64' });
    }
    return '';
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    if (savedProduct.image) {
      savedProduct.image = `${process.env.BASE_URL ?? 'http://localhost:3000'}/uploads/${savedProduct.image}`;
    }

    return savedProduct;
  }

  async findAll() {
    const products = await this.productRepository.find();
    products.forEach((p) => {
      if (p.image) {
        p.image = `${process.env.BASE_URL ?? 'http://localhost:3000'}/uploads/${p.image}`;
      }
    });
    return products;
  }

  async findOneBy(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new Error(`Product with id: ${id} not found`);
    }
    if (product.image) {
      product.image = `${process.env.BASE_URL ?? 'http://localhost:3000'}/uploads/${product.image}`;
    }
    return product;
  }

  async findByNamePartial(name: string) {
    const products = await this.productRepository.find({
      where: { name: Like(`%${name}%`) },
    });
    if (!products.length) {
      throw new Error(`Product with name ${name} not found`);
    }
    products.forEach((p) => {
      if (p.image) {
        p.image = `${process.env.BASE_URL ?? 'http://localhost:3000'}/uploads/${p.image}`;
      }
    });
    return products;
  }

  async findBy(type: string) {
    const products = await this.productRepository.findBy({
      type,
    });
    if (!products.length) {
      throw new Error(`Product with name ${type} not found`);
    }
    products.forEach((p) => {
      if (p.image) {
        p.image = `${process.env.BASE_URL ?? 'http://localhost:3000'}/uploads/${p.image}`;
      }
    });
    return products;
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
