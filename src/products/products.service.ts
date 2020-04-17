import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.client.dto';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(ProductRepository)
  private productRepository: ProductRepository) { }

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find()
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOne(id)

    if (!found) {
      throw new NotFoundException('Produto com o id "' + id + '" não foi encontrado')
    }

    return found
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product()
    const { name, value, photoUrl } = createProductDto

    product.name = name
    product.value = value
    product.photoUrl = photoUrl

    await product.save()

    return product
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id)

    await product.remove()
  }

  async updateProduct(updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(updateProductDto.id)

    if (updateProductDto.name) { product.name = updateProductDto.name }
    if (updateProductDto.value) { product.value = updateProductDto.value }
    if (updateProductDto.photoUrl) { product.photoUrl = updateProductDto.photoUrl }

    await product.save()
    return product
  }
}
