import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  private products: Product[] = [];
  private idCounter = 1;

  create(createProductDto: CreateProductDto): Product {
    const product = new Product({
      id: this.idCounter++,
      ...createProductDto,
    });
    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return [...this.products];
  }

  findOne(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
