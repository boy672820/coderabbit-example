import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // 업데이트할 필드만 적용
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }

    if (updateProductDto.stock !== undefined) {
      product.stock = updateProductDto.stock;
    }

    // 업데이트 시간 갱신
    product.updatedAt = new Date();

    return product;
  }

  search(searchProductDto: SearchProductDto): Product[] {
    let results = [...this.products];

    // 이름으로 검색
    if (searchProductDto.name) {
      results = results.filter((product) =>
        product.name
          .toLowerCase()
          .includes(searchProductDto.name!.toLowerCase()),
      );
    }

    // 최소 가격으로 필터링
    if (searchProductDto.minPrice !== undefined) {
      results = results.filter(
        (product) => product.price >= searchProductDto.minPrice!,
      );
    }

    // 최대 가격으로 필터링
    if (searchProductDto.maxPrice !== undefined) {
      results = results.filter(
        (product) => product.price <= searchProductDto.maxPrice!,
      );
    }

    // 재고 상태로 필터링
    if (searchProductDto.inStock !== undefined) {
      results = results.filter((product) =>
        searchProductDto.inStock ? product.stock > 0 : product.stock === 0,
      );
    }

    // 페이지네이션 적용
    if (
      searchProductDto.page !== undefined &&
      searchProductDto.limit !== undefined
    ) {
      const startIndex = (searchProductDto.page - 1) * searchProductDto.limit;
      const endIndex = startIndex + searchProductDto.limit;
      results = results.slice(startIndex, endIndex);
    }

    return results;
  }
}
