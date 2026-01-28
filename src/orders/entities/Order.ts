import { OrderState } from '../states/OrderState.js';
// eslint-disable-next-line import/no-cycle
import { NewOrderState } from '../states/NewOrderState.js';

export class Order {
  private state: OrderState;

  private readonly id: string;

  private readonly customerId: string;

  private readonly components: OrderComponent[];

  private readonly processingStrategy: OrderProcessingStrategy;

  private readonly createdAt: Date;

  private trackingNumber?: string;

  private priority: boolean;

  private international: boolean;

  constructor(
    id: string,
    customerId: string,
    components: OrderComponent[],
    processingStrategy: OrderProcessingStrategy,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.components = components;
    this.processingStrategy = processingStrategy;
    this.createdAt = new Date();
    this.state = new NewOrderState();
    this.priority = false;
    this.international = false;
  }

  // State pattern methods
  public getState(): OrderState {
    return this.state;
  }

  public setState(state: OrderState): void {
    this.state = state;
  }

  public getStatus(): string {
    return this.state.getStatus();
  }

  // Basic getters
  public getId(): string {
    return this.id;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Composite pattern methods
  public getComponents(): OrderComponent[] {
    return [...this.components];
  }

  public getTotalAmount(): number {
    const itemsTotal = this.components.reduce(
      (sum, component) => sum + component.getTotalPrice(),
      0,
    );
    const shippingCost = this.processingStrategy.calculateShippingCost(this.components);
    const processingFee = this.processingStrategy.getProcessingFee();
    return itemsTotal + shippingCost + processingFee;
  }

  public getItemsTotal(): number {
    return this.components.reduce(
      (sum, component) => sum + component.getTotalPrice(),
      0,
    );
  }

  // Strategy pattern methods
  public getProcessingStrategy(): OrderProcessingStrategy {
    return this.processingStrategy;
  }

  public getShippingCost(): number {
    return this.processingStrategy.calculateShippingCost(this.components);
  }

  public getProcessingFee(): number {
    return this.processingStrategy.getProcessingFee();
  }

  public getEstimatedDeliveryDays(): number {
    return this.processingStrategy.getEstimatedDeliveryDays();
  }

  public getEstimatedDeliveryDate(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + this.getEstimatedDeliveryDays());
    return deliveryDate;
  }

  // Tracking
  public setTrackingNumber(trackingNumber: string): void {
    this.trackingNumber = trackingNumber;
  }

  public getTrackingNumber(): string | undefined {
    return this.trackingNumber;
  }

  // Priority and international flags
  public setPriority(priority: boolean): void {
    this.priority = priority;
  }

  public isPriority(): boolean {
    return this.priority;
  }

  public setInternational(international: boolean): void {
    this.international = international;
  }

  public isInternational(): boolean {
    return this.international;
  }

  // State transition methods
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

  // Display methods
  public toString(): string {
    const priority = this.priority ? ' [PRIORITY]' : '';
    const international = this.international ? ' [INTERNATIONAL]' : '';
    return `Order #${this.id}${priority}${international} - Status: ${this.getStatus()}, Customer: ${this.customerId}, Total: $${this.getTotalAmount().toFixed(2)}`;
  }

  public getDetailedDescription(): string {
    let description = `Order #${this.id}\n`;
    description += `Customer: ${this.customerId}\n`;
    description += `Status: ${this.getStatus()}\n`;
    description += `Strategy: ${this.processingStrategy.getStrategyName()}\n`;
    description += `Created: ${this.createdAt.toLocaleString()}\n`;
    description += `\nComponents:\n`;
    
    this.components.forEach((component) => {
      description += component.getDescription() + '\n';
    });
    
    description += `\nItems Subtotal: $${this.getItemsTotal().toFixed(2)}\n`;
    description += `Shipping Cost: $${this.getShippingCost().toFixed(2)}\n`;
    description += `Processing Fee: $${this.getProcessingFee().toFixed(2)}\n`;
    description += `Total Amount: $${this.getTotalAmount().toFixed(2)}\n`;
    description += `Estimated Delivery: ${this.getEstimatedDeliveryDays()} business days`;
    
    if (this.trackingNumber) {
      description += `\nTracking Number: ${this.trackingNumber}`;
    }
    
    return description;
  }
}

// Keep the old interface for backward compatibility
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
