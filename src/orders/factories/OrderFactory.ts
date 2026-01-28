import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';

export abstract class OrderFactory {
  protected abstract createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy
  ): Order;

  public createOrder(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    if (!id || !customerId || !components || components.length === 0) {
      throw new Error('Invalid order parameters');
    }

    if (!strategy.canProcess(components)) {
      throw new Error(`Strategy ${strategy.getStrategyName()} cannot process this order`);
    }

    const order = this.createOrderInstance(id, customerId, components, strategy);

    this.logOrderCreation(order);

    return order;
  }

  protected logOrderCreation(order: Order): void {
    console.log(`Order ${order.getId()} created using ${this.getFactoryName()}`);
  }

  public abstract getFactoryName(): string;
}

