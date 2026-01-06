import { OrderComponent } from './OrderComponent.js';

/**
 * Composite Pattern - Leaf
 * Represents a single product item in an order
 */
export class OrderItem implements OrderComponent {
  private readonly productId: string;

  private readonly name: string;

  private readonly price: number;

  private readonly quantity: number;

  constructor(productId: string, name: string, price: number, quantity: number) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getTotalPrice(): number {
    return this.price * this.quantity;
  }

  public getDescription(): string {
    return `${this.name} x${this.quantity} @ $${this.price.toFixed(2)} = $${this.getTotalPrice().toFixed(2)}`;
  }

  public isComposite(): boolean {
    return false;
  }
}

