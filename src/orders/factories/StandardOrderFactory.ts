import { OrderFactory } from './OrderFactory.js';
import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';
import { StandardProcessingStrategy } from '../strategies/StandardProcessingStrategy.js';

/**
 * Factory Method Pattern - Concrete Creator
 * Creates standard orders with standard processing
 */
export class StandardOrderFactory extends OrderFactory {
  protected createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    // Standard orders use the provided strategy or default to standard
    const processingStrategy = strategy instanceof StandardProcessingStrategy 
      ? strategy 
      : strategy;

    return new Order(id, customerId, components, processingStrategy);
  }

  public getFactoryName(): string {
    return 'Standard Order Factory';
  }
}

