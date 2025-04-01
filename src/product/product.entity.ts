import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType({ description: '상품 모델' })
export class Product {
  @Field(() => ID)
  id: number;

  @Field({ description: '상품 이름' })
  name: string;

  @Field({ description: '상품 설명' })
  description: string;

  @Field(() => Float, { description: '상품 가격' })
  price: number;

  @Field(() => Int, { description: '재고 수량' })
  stock: number;

  @Field(() => Date, { description: '생성 일시' })
  createdAt: Date;

  @Field(() => Date, { description: '수정 일시' })
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
