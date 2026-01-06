import { Order } from '../entities/Order.js';
import { OrderState } from './OrderState.js';
import { DeliveredOrderState } from './DeliveredOrderState.js';

export class ShippedOrderState implements OrderState {
  public process(order: Order): void {
    console.log(`Order ${order.getId()} has already been processed`);
  }

  public ship(order: Order): void {
    console.log(`Order ${order.getId()} has already been shipped`);
  }

  public deliver(order: Order): void {
    console.log(`Order ${order.getId()} has been delivered`);
    order.setState(new DeliveredOrderState());
  }

  public cancel(_order: Order): void {
    throw new Error('Cannot cancel an order that has already been shipped');
  }

  public getStatus(): string {
    return 'SHIPPED';
  }
}

