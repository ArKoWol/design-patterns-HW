import { Order } from '../entities/Order.js';
import { OrderComponent } from '../components/OrderComponent.js';
import { OrderProcessingStrategy } from '../strategies/OrderProcessingStrategy.js';

/**
 * Factory Method Pattern - Creator (Abstract Factory)
 * Defines the factory method for creating orders
 */
export abstract class OrderFactory {
  /**
   * Factory Method - subclasses override this to create specific order types
   */
  protected abstract createOrderInstance(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy
  ): Order;

  /**
   * Factory Method - creates and configures an order
   */
  public createOrder(
    id: string,
    customerId: string,
    components: OrderComponent[],
    strategy: OrderProcessingStrategy,
  ): Order {
    // Validate inputs
    if (!id || !customerId || !components || components.length === 0) {
      throw new Error('Invalid order parameters');
    }

    if (!strategy.canProcess(components)) {
      throw new Error(`Strategy ${strategy.getStrategyName()} cannot process this order`);
    }

    // Create order using factory method
    const order = this.createOrderInstance(id, customerId, components, strategy);

    // Additional setup common to all orders
    this.logOrderCreation(order);

    return order;
  }

  protected logOrderCreation(order: Order): void {
    console.log(`Order ${order.getId()} created using ${this.getFactoryName()}`);
  }

  public abstract getFactoryName(): string;
}

