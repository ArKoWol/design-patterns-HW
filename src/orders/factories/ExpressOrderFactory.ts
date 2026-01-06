import { OrderFactory } from './OrderFactory.js';
import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';
import { ExpressProcessingStrategy } from '../strategies/ExpressProcessingStrategy.js';

/**
 * Factory Method Pattern - Concrete Creator
 * Creates express orders with priority handling
 */
export class ExpressOrderFactory extends OrderFactory {
  protected createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    // Express orders should use express strategy
    const processingStrategy = strategy instanceof ExpressProcessingStrategy 
      ? strategy 
      : new ExpressProcessingStrategy();

    const order = new Order(id, customerId, components, processingStrategy);
    
    // Mark as priority
    order.setPriority(true);
    
    return order;
  }

  public getFactoryName(): string {
    return 'Express Order Factory';
  }

  protected logOrderCreation(order: Order): void {
    console.log(`⚡ EXPRESS ORDER ${order.getId()} created - Priority Processing Enabled`);
  }
}

