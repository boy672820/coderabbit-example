import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
        stock: 100,
      };

      // Act
      const result = service.create(createProductDto);

      // Assert
      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe(1);
      expect(result.name).toBe(createProductDto.name);
      expect(result.description).toBe(createProductDto.description);
      expect(result.price).toBe(createProductDto.price);
      expect(result.stock).toBe(createProductDto.stock);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should increment id for each new product', () => {
      // Arrange
      const createProductDto1: CreateProductDto = {
        name: '상품 1',
        description: '상품 1 설명',
        price: 10000,
        stock: 100,
      };

      const createProductDto2: CreateProductDto = {
        name: '상품 2',
        description: '상품 2 설명',
        price: 20000,
        stock: 200,
      };

      // Act
      const result1 = service.create(createProductDto1);
      const result2 = service.create(createProductDto2);

      // Assert
      expect(result1.id).toBe(1);
      expect(result2.id).toBe(2);
    });
  });

  describe('update', () => {
    it('should update a product', () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
        stock: 100,
      };
      
      const product = service.create(createProductDto);
      const originalUpdatedAt = product.updatedAt;
      
      // 업데이트 전에 시간이 지나도록 잠시 대기
      jest.advanceTimersByTime(1000);
      
      const updateProductDto: UpdateProductDto = {
        name: '수정된 상품',
        price: 20000,
      };

      // Act
      const result = service.update(product.id, updateProductDto);

      // Assert
      expect(result.id).toBe(product.id);
      expect(result.name).toBe(updateProductDto.name);
      expect(result.description).toBe(createProductDto.description); // 수정되지 않은 필드
      expect(result.price).toBe(updateProductDto.price);
      expect(result.stock).toBe(createProductDto.stock); // 수정되지 않은 필드
      expect(result.updatedAt).not.toEqual(originalUpdatedAt); // 업데이트 시간이 변경됨
    });

    it('should throw NotFoundException when product not found', () => {
      // Arrange
      const nonExistentId = 999;
      const updateProductDto: UpdateProductDto = {
        name: '수정된 상품',
      };

      // Act & Assert
      expect(() => {
        service.update(nonExistentId, updateProductDto);
      }).toThrow(NotFoundException);
      expect(() => {
        service.update(nonExistentId, updateProductDto);
      }).toThrow(`Product with ID ${nonExistentId} not found`);
    });

    it('should update only the provided fields', () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
        stock: 100,
      };
      
      const product = service.create(createProductDto);
      
      const updateProductDto: UpdateProductDto = {
        price: 20000,
      };

      // Act
      const result = service.update(product.id, updateProductDto);

      // Assert
      expect(result.name).toBe(createProductDto.name); // 수정되지 않음
      expect(result.description).toBe(createProductDto.description); // 수정되지 않음
      expect(result.price).toBe(updateProductDto.price); // 수정됨
      expect(result.stock).toBe(createProductDto.stock); // 수정되지 않음
    });
  });

  describe('search', () => {
    beforeEach(() => {
      // 테스트용 상품 데이터 생성
      service.create({
        name: '노트북',
        description: '고성능 노트북',
        price: 1500000,
        stock: 10,
      });
      
      service.create({
        name: '스마트폰',
        description: '최신 스마트폰',
        price: 1000000,
        stock: 20,
      });
      
      service.create({
        name: '헤드폰',
        description: '무선 헤드폰',
        price: 300000,
        stock: 30,
      });
      
      service.create({
        name: '키보드',
        description: '기계식 키보드',
        price: 150000,
        stock: 0,
      });
    });

    it('should search products by name', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        name: '폰',
      };

      // Act
      const result = service.search(searchDto);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].name).toContain('폰');
      expect(result[1].name).toContain('폰');
    });

    it('should filter products by price range', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        minPrice: 200000,
        maxPrice: 1200000,
      };

      // Act
      const result = service.search(searchDto);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].price).toBeGreaterThanOrEqual(200000);
      expect(result[0].price).toBeLessThanOrEqual(1200000);
      expect(result[1].price).toBeGreaterThanOrEqual(200000);
      expect(result[1].price).toBeLessThanOrEqual(1200000);
    });

    it('should filter products by stock availability', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        inStock: true,
      };

      // Act
      const result = service.search(searchDto);

      // Assert
      expect(result.length).toBe(3);
      result.forEach((product) => {
        expect(product.stock).toBeGreaterThan(0);
      });
    });

    it('should apply pagination', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        page: 1,
        limit: 2,
      };

      // Act
      const result = service.search(searchDto);

      // Assert
      expect(result.length).toBe(2);
    });

    it('should combine multiple search criteria', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        minPrice: 100000,
        inStock: true,
        page: 1,
        limit: 1,
      };

      // Act
      const result = service.search(searchDto);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].price).toBeGreaterThanOrEqual(100000);
      expect(result[0].stock).toBeGreaterThan(0);
    });
  });
});
