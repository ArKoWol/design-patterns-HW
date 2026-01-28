import { OrderProcessingStrategy } from './OrderProcessingStrategy.js';
import { OrderComponent } from '../components/OrderComponent.js';

export class ExpressProcessingStrategy implements OrderProcessingStrategy {
  public getStrategyName(): string {
    return 'Express Processing';
  }

  public calculateShippingCost(components: OrderComponent[]): number {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    
    const shippingCost = totalPrice * 0.15;
    return Math.max(shippingCost, 15);
  }

  public getEstimatedDeliveryDays(): number {
    return 2;
  }

  public getProcessingFee(): number {
    return 9.99;
  }

  public canProcess(components: OrderComponent[]): boolean {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    return components.length > 0 && totalPrice < 5000;
  }

  public getDescription(): string {
    return 'Express processing with 1-2 business days delivery. Additional processing fee of $9.99 applies.';
  }
}

