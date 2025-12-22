import type { Order } from '../entities/Order';

export interface OrderState {
  process(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
  getStatus(): string;
}

