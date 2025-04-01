import { Field, InputType, Float, Int } from '@nestjs/graphql';

@InputType({ description: '상품 생성 입력 타입' })
export class CreateProductDto {
  @Field({ description: '상품 이름' })
  name: string;

  @Field({ description: '상품 설명' })
  description: string;

  @Field(() => Float, { description: '상품 가격' })
  price: number;

  @Field(() => Int, { description: '재고 수량' })
  stock: number;
}
