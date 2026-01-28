import { OrderFactory } from './OrderFactory.js';
import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';
import { ExpressProcessingStrategy } from '../strategies/ExpressProcessingStrategy.js';

export class ExpressOrderFactory extends OrderFactory {
  protected createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    const processingStrategy = strategy instanceof ExpressProcessingStrategy 
      ? strategy 
      : new ExpressProcessingStrategy();

    const order = new Order(id, customerId, components, processingStrategy);
    
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

