import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product, { description: '상품 생성' })
  createProduct(
    @Args('input', { type: () => CreateProductDto })
    createProductDto: CreateProductDto,
  ): Product {
    return this.productService.create(createProductDto);
  }

  @Query(() => [Product], { description: '모든 상품 조회' })
  products(): Product[] {
    return this.productService.findAll();
  }

  @Query(() => Product, { description: '단일 상품 조회', nullable: true })
  product(@Args('id', { type: () => Int }) id: number): Product | undefined {
    return this.productService.findOne(id);
  }
}
