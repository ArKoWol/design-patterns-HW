import { OrderProcessingStrategy } from './OrderProcessingStrategy.js';
import { OrderComponent } from '../components/OrderComponent.js';

export class InternationalProcessingStrategy implements OrderProcessingStrategy {
  private readonly destinationCountry: string;

  constructor(destinationCountry: string) {
    this.destinationCountry = destinationCountry;
  }

  public getStrategyName(): string {
    return `International Processing (${this.destinationCountry})`;
  }

  public calculateShippingCost(components: OrderComponent[]): number {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    
    const shippingCost = totalPrice * 0.25;
    return Math.max(shippingCost, 30);
  }

  public getEstimatedDeliveryDays(): number {
    return 14;
  }

  public getProcessingFee(): number {
    return 19.99;
  }

  public canProcess(components: OrderComponent[]): boolean {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    return components.length > 0 && totalPrice >= 50 && totalPrice < 10000;
  }

  public getDescription(): string {
    return `International processing to ${this.destinationCountry} with 10-14 business days delivery. Includes customs documentation fee of $19.99.`;
  }

  public getDestinationCountry(): string {
    return this.destinationCountry;
  }
}

