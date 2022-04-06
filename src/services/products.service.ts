import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import slugify from 'slugify';

type CreateProductInput = {
  title: string;
};

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.tb_product.findMany();
  }

  async findById(id: string) {
    return this.prisma.tb_product.findFirst({ where: { id } });
  }

  async create({ title }: CreateProductInput) {
    const slug = slugify(title, { lower: true });
    const productWithSameSlug = await this.prisma.tb_product.findUnique({
      where: {
        slug,
      },
    });
    if (productWithSameSlug) {
      throw new Error('Another product with same slug already exists');
    }
    return await this.prisma.tb_product.create({ data: { title, slug } });
  }
}
