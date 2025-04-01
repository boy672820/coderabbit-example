import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
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
});
