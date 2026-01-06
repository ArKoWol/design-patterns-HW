import { OrderProcessingStrategy } from './OrderProcessingStrategy.js';
import { OrderComponent } from '../components/OrderComponent.js';

/**
 * Strategy Pattern - Concrete Strategy
 * Standard processing with regular shipping
 */
export class StandardProcessingStrategy implements OrderProcessingStrategy {
  public getStrategyName(): string {
    return 'Standard Processing';
  }

  public calculateShippingCost(components: OrderComponent[]): number {
    const totalPrice = components.reduce((sum, component) => sum + component.getTotalPrice(), 0);
    
    // Free shipping for orders over $100
    if (totalPrice > 100) {
      return 0;
    }
    
    // $5.99 flat rate for standard shipping
    return 5.99;
  }

  public getEstimatedDeliveryDays(): number {
    return 5; // 5-7 business days
  }

  public getProcessingFee(): number {
    return 0; // No processing fee for standard
  }

  public canProcess(components: OrderComponent[]): boolean {
    return components.length > 0;
  }

  public getDescription(): string {
    return 'Standard processing with 5-7 business days delivery. Free shipping on orders over $100.';
  }
}

