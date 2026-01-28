import { OrderComponent } from '../components/OrderComponent.js';

/**
 * Strategy Pattern - Strategy Interface
 * Defines the interface for order processing strategies
 */
export interface OrderProcessingStrategy {
  getStrategyName(): string;
  calculateShippingCost(components: OrderComponent[]): number;
  getEstimatedDeliveryDays(): number;
  getProcessingFee(): number;
  canProcess(components: OrderComponent[]): boolean;
  getDescription(): string;
}

