import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

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
    const { name, value, photoUrl, isRent } = createProductDto

    product.name = name
    product.value = value
    product.photoUrl = photoUrl
    product.isRent = isRent === "true"

    console.log(isRent)
    console.log(product.isRent)

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
    if (updateProductDto.isRent) { product.isRent = updateProductDto.isRent === "true" }

    await product.save()
    return product
  }
}
