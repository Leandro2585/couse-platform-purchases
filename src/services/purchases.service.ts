import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/messaging/kafka.service';
import { PrismaService } from '../database/prisma/prisma.service';

type CreatePurchaseInput = {
  customer_id: string;
  product_id: string;
};

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  async create({ customer_id, product_id }: CreatePurchaseInput) {
    const product = await this.prisma.tb_product.findUnique({
      where: { id: product_id },
    });
    if (!product) {
      throw new Error('Product not found.');
    }
    const purchase = await this.prisma.tb_purchase.create({
      data: {
        customer_id,
        product_id,
      },
    });
    const { user_id } = await this.prisma.tb_customer.findUnique({
      where: { id: customer_id },
    });
    this.kafka.emit('purchases.new-purchase', {
      customer: {
        user_id,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });
    return purchase;
  }

  async findAll() {
    return this.prisma.tb_purchase.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findAllFromCustomer(customer_id: string) {
    return this.prisma.tb_purchase.findMany({
      where: { customer_id },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
