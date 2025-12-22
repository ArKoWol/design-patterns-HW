import { InventoryService } from '../../../src/orders/services/InventoryService';
import { OrderItem } from '../../../src/orders/entities/Order';

describe('InventoryService', () => {
  let inventoryService: InventoryService;

  beforeEach(() => {
    inventoryService = new InventoryService();
  });

  describe('checkAvailability', () => {
    it('should return true for available items', () => {
      const items: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 5, price: 999.99 }
      ];

      const result = inventoryService.checkAvailability(items);
      expect(result).toBe(true);
    });

    it('should return false for unavailable items', () => {
      const items: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 200, price: 999.99 }
      ];

      const result = inventoryService.checkAvailability(items);
      expect(result).toBe(false);
    });

    it('should return false for non-existent products', () => {
      const items: OrderItem[] = [
        { productId: 'PROD999', productName: 'Unknown', quantity: 1, price: 999.99 }
      ];

      const result = inventoryService.checkAvailability(items);
      expect(result).toBe(false);
    });
  });

  describe('reserveItems', () => {
    it('should reserve available items', () => {
      const items: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 5, price: 999.99 }
      ];

      const initialQty = inventoryService.getAvailableQuantity('PROD001');
      const result = inventoryService.reserveItems(items);
      const finalQty = inventoryService.getAvailableQuantity('PROD001');

      expect(result).toBe(true);
      expect(finalQty).toBe(initialQty - 5);
    });

    it('should not reserve unavailable items', () => {
      const items: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 200, price: 999.99 }
      ];

      const initialQty = inventoryService.getAvailableQuantity('PROD001');
      const result = inventoryService.reserveItems(items);
      const finalQty = inventoryService.getAvailableQuantity('PROD001');

      expect(result).toBe(false);
      expect(finalQty).toBe(initialQty);
    });
  });

  describe('releaseItems', () => {
    it('should release items back to inventory', () => {
      const items: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 5, price: 999.99 }
      ];

      const initialQty = inventoryService.getAvailableQuantity('PROD001');
      inventoryService.releaseItems(items);
      const finalQty = inventoryService.getAvailableQuantity('PROD001');

      expect(finalQty).toBe(initialQty + 5);
    });
  });

  describe('getAvailableQuantity', () => {
    it('should return quantity for existing products', () => {
      const qty = inventoryService.getAvailableQuantity('PROD001');
      expect(qty).toBeGreaterThan(0);
    });

    it('should return 0 for non-existent products', () => {
      const qty = inventoryService.getAvailableQuantity('PROD999');
      expect(qty).toBe(0);
    });
  });
});

