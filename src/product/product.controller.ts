import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Get('search')
  search(@Query() searchProductDto: SearchProductDto): Product[] {
    return this.productService.search(searchProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product | undefined {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Product {
    return this.productService.update(+id, updateProductDto);
  }
}
