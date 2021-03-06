import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }

  @Get('/:id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
  }
}
