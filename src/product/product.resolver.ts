import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

// GraphQL 스키마에 정의된 타입과 일치하는 인터페이스 정의
interface ProductFilterInput {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface PaginationInput {
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation('createProduct')
  createProduct(@Args('input') createProductDto: CreateProductDto): Product {
    return this.productService.create(createProductDto);
  }

  @Query('products')
  products(
    @Args('filter', { nullable: true }) filter?: ProductFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): ProductsResponse {
    // filter와 pagination을 SearchProductDto로 변환
    const searchDto = new SearchProductDto();

    if (filter) {
      if (filter.name !== undefined) searchDto.name = filter.name;
      if (filter.minPrice !== undefined) searchDto.minPrice = filter.minPrice;
      if (filter.maxPrice !== undefined) searchDto.maxPrice = filter.maxPrice;
      if (filter.inStock !== undefined) searchDto.inStock = filter.inStock;
    }

    // 페이지네이션 설정
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    searchDto.page = page;
    searchDto.limit = limit;

    // 검색 결과 가져오기
    const items = this.productService.search(searchDto);

    // 전체 상품 수 계산 (페이지네이션 없이 필터만 적용)
    const searchDtoWithoutPagination = { ...searchDto };
    delete searchDtoWithoutPagination.page;
    delete searchDtoWithoutPagination.limit;
    const totalItems = this.productService.search(searchDtoWithoutPagination);

    // 응답 구성
    return {
      items,
      total: totalItems.length,
      page,
      limit,
      hasMore: page * limit < totalItems.length,
    };
  }

  @Query('product')
  product(@Args('id') id: number): Product | undefined {
    return this.productService.findOne(id);
  }
}
