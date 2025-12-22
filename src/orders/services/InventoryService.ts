import { OrderItem } from '../entities/Order';

export class InventoryService {
  private inventory: Map<string, number>;

  constructor() {
    this.inventory = new Map();
    this.inventory.set('PROD001', 100);
    this.inventory.set('PROD002', 50);
    this.inventory.set('PROD003', 75);
  }

  public checkAvailability(items: OrderItem[]): boolean {
    console.log('Checking inventory availability...');

    const allAvailable = items.every((item) => {
      const available = this.inventory.get(item.productId) || 0;
      if (available < item.quantity) {
        console.log(`Insufficient inventory for product ${item.productId}: need ${item.quantity}, have ${available}`);
        return false;
      }
      return true;
    });

    if (allAvailable) {
      console.log('All items are available in inventory');
    }
    return allAvailable;
  }

  public reserveItems(items: OrderItem[]): boolean {
    console.log('Reserving items in inventory...');

    if (!this.checkAvailability(items)) {
      return false;
    }

    items.forEach((item) => {
      const available = this.inventory.get(item.productId)!;
      this.inventory.set(item.productId, available - item.quantity);
      console.log(`Reserved ${item.quantity} units of product ${item.productId}`);
    });

    return true;
  }

  public releaseItems(items: OrderItem[]): void {
    console.log('Releasing items back to inventory...');

    items.forEach((item) => {
      const available = this.inventory.get(item.productId) || 0;
      this.inventory.set(item.productId, available + item.quantity);
      console.log(`Released ${item.quantity} units of product ${item.productId}`);
    });
  }

  public getAvailableQuantity(productId: string): number {
    return this.inventory.get(productId) || 0;
  }
}
