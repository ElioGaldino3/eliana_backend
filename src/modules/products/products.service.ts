import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { Cron } from '@nestjs/schedule';
import { writeFile } from 'fs';
import moment = require('moment');
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@InjectRepository(ProductRepository)
  private productRepository: ProductRepository) { }

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({
      order: { name: "ASC" }
    })
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
    product.isRent = isRent

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
    if (updateProductDto.isRent) { product.isRent = updateProductDto.isRent }

    await product.save()
    return product
  }

  @Cron('* * 3 * * 1-6')
  async handleBackup() {
    const products = JSON.stringify(await this.getProducts());
    const path = process.env.BACKUP_PATH + `/${moment().format()}` + '.products.json'
    writeFile(path, products, 'utf8', err => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.log("bfeg :D");
      }
    });
  }
}
