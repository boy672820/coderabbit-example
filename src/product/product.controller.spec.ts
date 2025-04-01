import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedProduct = new Product({
        id: 1,
        ...createProductDto,
      });

      const createSpy = jest
        .spyOn(service, 'create')
        .mockReturnValue(expectedProduct);

      // Act
      const result = controller.create(createProductDto);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(createProductDto);
      expect(result).toBe(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      // Arrange
      const expectedProducts = [
        new Product({
          id: 1,
          name: '상품 1',
          description: '상품 1 설명',
          price: 10000,
          stock: 100,
        }),
        new Product({
          id: 2,
          name: '상품 2',
          description: '상품 2 설명',
          price: 20000,
          stock: 200,
        }),
      ];

      const findAllSpy = jest
        .spyOn(service, 'findAll')
        .mockReturnValue(expectedProducts);

      // Act
      const result = controller.findAll();

      // Assert
      expect(findAllSpy).toHaveBeenCalled();
      expect(result).toBe(expectedProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', () => {
      // Arrange
      const expectedProduct = new Product({
        id: 1,
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
        stock: 100,
      });

      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockReturnValue(expectedProduct);

      // Act
      const result = controller.findOne('1');

      // Assert
      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(result).toBe(expectedProduct);
    });
  });

  describe('update', () => {
    it('should update a product', () => {
      // Arrange
      const productId = '1';
      const updateProductDto: UpdateProductDto = {
        name: '수정된 상품',
        price: 20000,
      };

      const expectedProduct = new Product({
        id: 1,
        name: '수정된 상품',
        description: '테스트 상품 설명',
        price: 20000,
        stock: 100,
      });

      const updateSpy = jest
        .spyOn(service, 'update')
        .mockReturnValue(expectedProduct);

      // Act
      const result = controller.update(productId, updateProductDto);

      // Assert
      expect(updateSpy).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toBe(expectedProduct);
    });

    it('should handle NotFoundException from service', () => {
      // Arrange
      const productId = '999';
      const updateProductDto: UpdateProductDto = {
        name: '수정된 상품',
      };

      jest
        .spyOn(service, 'update')
        .mockImplementation(() => {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        });

      // Act & Assert
      expect(() => {
        controller.update(productId, updateProductDto);
      }).toThrow(NotFoundException);
      expect(() => {
        controller.update(productId, updateProductDto);
      }).toThrow(`Product with ID ${productId} not found`);
    });
  });

  describe('search', () => {
    it('should search products with query parameters', () => {
      // Arrange
      const searchDto: SearchProductDto = {
        name: '테스트',
        minPrice: 5000,
        maxPrice: 20000,
        inStock: true,
        page: 1,
        limit: 10,
      };

      const expectedProducts = [
        new Product({
          id: 1,
          name: '테스트 상품',
          description: '테스트 상품 설명',
          price: 10000,
          stock: 100,
        }),
      ];

      const searchSpy = jest
        .spyOn(service, 'search')
        .mockReturnValue(expectedProducts);

      // Act
      const result = controller.search(searchDto);

      // Assert
      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toBe(expectedProducts);
    });

    it('should handle empty search parameters', () => {
      // Arrange
      const searchDto: SearchProductDto = {};

      const allProducts = [
        new Product({
          id: 1,
          name: '상품 1',
          description: '상품 1 설명',
          price: 10000,
          stock: 100,
        }),
        new Product({
          id: 2,
          name: '상품 2',
          description: '상품 2 설명',
          price: 20000,
          stock: 200,
        }),
      ];

      const searchSpy = jest
        .spyOn(service, 'search')
        .mockReturnValue(allProducts);

      // Act
      const result = controller.search(searchDto);

      // Assert
      expect(searchSpy).toHaveBeenCalledWith(searchDto);
      expect(result).toBe(allProducts);
      expect(result.length).toBe(2);
    });
  });
});
