export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
