import { OrderComponent } from '../components/OrderComponent.js';

export interface OrderProcessingStrategy {
  getStrategyName(): string;
  calculateShippingCost(components: OrderComponent[]): number;
  getEstimatedDeliveryDays(): number;
  getProcessingFee(): number;
  canProcess(components: OrderComponent[]): boolean;
  getDescription(): string;
}

