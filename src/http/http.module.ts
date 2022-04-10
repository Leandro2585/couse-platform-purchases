import path from 'node:path';
import { Module } from '@nestjs/common';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '../database/database.module';
import { ProductResolver, PurchaseResolver } from './graphql/resolvers';
import { PurchaseService, ProductService, CustomerService } from '../services';
import { CustomerResolver } from './graphql/resolvers/customers.resolver';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MessagingModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    // Resolvers
    ProductResolver,
    PurchaseResolver,
    CustomerResolver,

    // Services
    ProductService,
    PurchaseService,
    CustomerService,
  ],
})
export class HttpModule {}
