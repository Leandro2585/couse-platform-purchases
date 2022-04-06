import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';

import { AuthorizationGuard } from '../../../http/auth/authorization.guard';
import { Product, Purchase } from '../models';
import {
  CustomerService,
  ProductService,
  PurchaseService,
} from '../../../services';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { CurrentUser, AuthUser } from 'src/http/auth';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private customerService: CustomerService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  loadPurchases() {
    return this.purchaseService.findAll();
  }

  @ResolveField(() => Product)
  product(@Parent() purchase: Purchase) {
    return this.productService.findById(purchase.product_id);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    let customer = await this.customerService.findByUserId(user.sub);
    if (!customer) {
      customer = await this.customerService.create({ user_id: user.sub });
    }
    return this.purchaseService.create({
      customer_id: customer.id,
      product_id: data.product_id,
    });
  }
}
