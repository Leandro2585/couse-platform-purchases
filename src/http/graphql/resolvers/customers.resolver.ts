import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CustomerService, PurchaseService } from '../../../services';
import { AuthUser, CurrentUser } from '../../../http/auth';
import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchaseService,
  ) {}

  @Query(() => Customer)
  me(@CurrentUser() user: AuthUser) {
    return this.customerService.findByUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    return this.purchaseService.findAllFromCustomer(customer.id);
  }
}
