import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

type CreatePurchaseInput = {
  customer_id: string;
  product_id: string;
};

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async create({ customer_id, product_id }: CreatePurchaseInput) {
    const product = await this.prisma.tb_product.findUnique({
      where: { id: product_id },
    });
    if (!product) {
      throw new Error('Product not found.');
    }
    return await this.prisma.tb_purchase.create({
      data: {
        customer_id,
        product_id,
      },
    });
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
