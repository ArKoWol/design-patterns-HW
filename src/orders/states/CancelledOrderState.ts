import { Order } from '../entities/Order';
import { OrderState } from './OrderState';

export class CancelledOrderState implements OrderState {
  public process(_order: Order): void {
    throw new Error('Cannot process a cancelled order');
  }

  public ship(_order: Order): void {
    throw new Error('Cannot ship a cancelled order');
  }

  public deliver(_order: Order): void {
    throw new Error('Cannot deliver a cancelled order');
  }

  public cancel(order: Order): void {
    console.log(`Order ${order.getId()} is already cancelled`);
  }

  public getStatus(): string {
    return 'CANCELLED';
  }
}

