import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation('createProduct')
  createProduct(@Args('input') createProductDto: CreateProductDto): Product {
    return this.productService.create(createProductDto);
  }

  @Query('products')
  products(): Product[] {
    return this.productService.findAll();
  }

  @Query('product')
  product(@Args('id') id: number): Product | undefined {
    return this.productService.findOne(id);
  }
}
