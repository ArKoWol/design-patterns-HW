import { OrderProcessingStrategy } from './OrderProcessingStrategy.js';
import { OrderComponent } from '../components/OrderComponent.js';

export class StandardProcessingStrategy implements OrderProcessingStrategy {
  public getStrategyName(): string {
    return 'Standard Processing';
  }

  public calculateShippingCost(components: OrderComponent[]): number {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    
    if (totalPrice > 100) {
      return 0;
    }
    
    return 5.99;
  }

  public getEstimatedDeliveryDays(): number {
    return 5;
  }

  public getProcessingFee(): number {
    return 0;
  }

  public canProcess(components: OrderComponent[]): boolean {
    return components.length > 0;
  }

  public getDescription(): string {
    return 'Standard processing with 5-7 business days delivery. Free shipping on orders over $100.';
  }
}

