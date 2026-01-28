import { OrderFactory } from './OrderFactory.js';
import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';
import { InternationalProcessingStrategy } from '../strategies/InternationalProcessingStrategy.js';

export class InternationalOrderFactory extends OrderFactory {
  private readonly defaultCountry: string;

  constructor(defaultCountry: string = 'UNKNOWN') {
    super();
    this.defaultCountry = defaultCountry;
  }

  protected createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    let processingStrategy: InternationalProcessingStrategy;
    
    if (strategy instanceof InternationalProcessingStrategy) {
      processingStrategy = strategy;
    } else {
      processingStrategy = new InternationalProcessingStrategy(this.defaultCountry);
    }

    const order = new Order(id, customerId, components, processingStrategy);
    
    order.setInternational(true);
    
    return order;
  }

  public getFactoryName(): string {
    return 'International Order Factory';
  }

  protected logOrderCreation(order: Order): void {
    console.log(`🌍 INTERNATIONAL ORDER ${order.getId()} created - Customs Processing Required`);
  }

  public getDefaultCountry(): string {
    return this.defaultCountry;
  }
}

