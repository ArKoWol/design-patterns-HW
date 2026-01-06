import { Order } from '../entities/Order.js';
import { OrderState } from './OrderState.js';

export class DeliveredOrderState implements OrderState {
  public process(order: Order): void {
    console.log(`Order ${order.getId()} has already been delivered`);
  }

  public ship(order: Order): void {
    console.log(`Order ${order.getId()} has already been delivered`);
  }

  public deliver(order: Order): void {
    console.log(`Order ${order.getId()} has already been delivered`);
  }

  public cancel(_order: Order): void {
    throw new Error('Cannot cancel an order that has been delivered');
  }

  public getStatus(): string {
    return 'DELIVERED';
  }
}

