import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOrderPipe implements PipeTransform {
  transform(value: any) {

    console.log(value.products)

    const products = JSON.parse(value.products)
    value.products = products
    return value;
  }
}