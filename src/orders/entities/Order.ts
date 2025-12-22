import { OrderState } from '../states/OrderState';
// eslint-disable-next-line import/no-cycle
import { NewOrderState } from '../states/NewOrderState';

export class Order {
  private state: OrderState;

  private readonly id: string;

  private readonly customerId: string;

  private readonly items: OrderItem[];

  private readonly totalAmount: number;

  private readonly createdAt: Date;

  private trackingNumber?: string;

  constructor(
    id: string,
    customerId: string,
    items: OrderItem[],
    totalAmount: number,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.createdAt = new Date();
    this.state = new NewOrderState();
  }

  public getState(): OrderState {
    return this.state;
  }

  public setState(state: OrderState): void {
    this.state = state;
  }

  public getId(): string {
    return this.id;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getItems(): OrderItem[] {
    return [...this.items];
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setTrackingNumber(trackingNumber: string): void {
    this.trackingNumber = trackingNumber;
  }

  public getTrackingNumber(): string | undefined {
    return this.trackingNumber;
  }

  public process(): void {
    this.state.process(this);
  }

  public ship(): void {
    this.state.ship(this);
  }

  public deliver(): void {
    this.state.deliver(this);
  }

  public cancel(): void {
    this.state.cancel(this);
  }

  public getStatus(): string {
    return this.state.getStatus();
  }

  public toString(): string {
    return `Order #${this.id} - Status: ${this.getStatus()}, Customer: ${this.customerId}, Total: $${this.totalAmount.toFixed(2)}`;
  }
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
