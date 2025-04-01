import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(): Product[] {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product | undefined {
    return this.productService.findOne(+id);
  }
}
