import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Purchase } from './purchase';

@ObjectType('user')
@Directive('@key(fields: "user_id")')
export class Customer {
  id: string;

  @Field(() => ID)
  user_id: string;

  @Field(() => [Purchase])
  purchases: Purchase[];
}
