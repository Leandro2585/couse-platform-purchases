import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

type CreateCustomerInput = {
  user_id: string;
};

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(user_id: string) {
    return await this.prisma.tb_customer.findUnique({ where: { user_id } });
  }

  async create({ user_id }: CreateCustomerInput) {
    return await this.prisma.tb_customer.create({ data: { user_id } });
  }
}
