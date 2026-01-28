import { OrderFactory } from './OrderFactory.js';
import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';
import { StandardProcessingStrategy } from '../strategies/StandardProcessingStrategy.js';

export class StandardOrderFactory extends OrderFactory {
  protected createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    const processingStrategy = strategy instanceof StandardProcessingStrategy 
      ? strategy 
      : strategy;

    return new Order(id, customerId, components, processingStrategy);
  }

  public getFactoryName(): string {
    return 'Standard Order Factory';
  }
}

