import { Order } from '../entities/Order';
import { OrderState } from './OrderState';
import { ShippedOrderState } from './ShippedOrderState';
import { CancelledOrderState } from './CancelledOrderState';

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

