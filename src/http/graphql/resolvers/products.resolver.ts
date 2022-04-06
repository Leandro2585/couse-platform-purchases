import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthorizationGuard } from '../../../http/auth';
import { CreateProductInput } from '../inputs/create-product-input';
import { ProductService } from '../../../services';
import { Product } from '../models';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  loadProducts() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  @UseGuards(AuthorizationGuard)
  createProduct(@Args('data') data: CreateProductInput) {
    return this.productService.create(data);
  }
}
