import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        'Produto com o id "' + id + '" não foi encontrado',
      );
    }

    return found;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    const { name, value, photoUrl, isRent } = createProductDto;

    try {
      if (value.includes(',')) {
        throw new BadRequestException('Is not float number');
      } else {
        parseFloat(value);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    product.name = name;
    product.value = value;
    product.photoUrl = photoUrl;
    product.isRent = isRent || false;

    await product.save();

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id);

    await product.remove();
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    if (updateProductDto.name) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.value) {
      product.value = updateProductDto.value;
    }
    if (updateProductDto.isRent) {
      product.isRent = updateProductDto.isRent;
    }

    await product.save();
    return product;
  }
}
