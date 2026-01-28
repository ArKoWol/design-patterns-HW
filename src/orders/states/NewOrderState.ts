import { Order } from '../entities/Order.js';
import { OrderState } from './OrderState.js';
import { ProcessingOrderState } from './ProcessingOrderState.js';
import { CancelledOrderState } from './CancelledOrderState.js';

export class NewOrderState implements OrderState {
  public process(order: Order): void {
    console.log(`Order ${order.getId()} is being processed...`);
    order.setState(new ProcessingOrderState());
  }

  public ship(_order: Order): void {
    throw new Error('Cannot ship an order that has not been processed yet');
  }

  public deliver(_order: Order): void {
    throw new Error('Cannot deliver an order that has not been processed yet');
  }

  public cancel(order: Order): void {
    console.log(`Order ${order.getId()} has been cancelled`);
    order.setState(new CancelledOrderState());
  }

  public getStatus(): string {
    return 'NEW';
  }
}

