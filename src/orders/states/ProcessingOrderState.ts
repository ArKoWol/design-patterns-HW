import { Order } from '../entities/Order.js';
import { OrderState } from './OrderState.js';
import { ShippedOrderState } from './ShippedOrderState.js';
import { CancelledOrderState } from './CancelledOrderState.js';

export class ProcessingOrderState implements OrderState {
  public process(order: Order): void {
    console.log(`Order ${order.getId()} is already being processed`);
  }

  public ship(order: Order): void {
    console.log(`Order ${order.getId()} has been shipped`);
    order.setState(new ShippedOrderState());
  }

  public deliver(_order: Order): void {
    throw new Error('Cannot deliver an order that has not been shipped yet');
  }

  public cancel(order: Order): void {
    console.log(`Order ${order.getId()} has been cancelled during processing`);
    order.setState(new CancelledOrderState());
  }

  public getStatus(): string {
    return 'PROCESSING';
  }
}

