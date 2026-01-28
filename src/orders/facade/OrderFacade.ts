import { Order, OrderItem } from '../entities/Order.js';
import { PaymentService } from '../services/PaymentService.js';
import { InventoryService } from '../services/InventoryService.js';
import { ShippingService } from '../services/ShippingService.js';
import { NotificationService } from '../services/NotificationService.js';

export class OrderFacade {
  private orders: Map<string, Order>;

  private orderIdCounter: number;

  private paymentService: PaymentService;

  private inventoryService: InventoryService;

  private shippingService: ShippingService;

  private notificationService: NotificationService;

  constructor(
    paymentService?: PaymentService,
    inventoryService?: InventoryService,
    shippingService?: ShippingService,
    notificationService?: NotificationService,
  ) {
    this.orders = new Map();
    this.orderIdCounter = 1000;
    this.paymentService = paymentService || new PaymentService();
    this.inventoryService = inventoryService || new InventoryService();
    this.shippingService = shippingService || new ShippingService();
    this.notificationService = notificationService || new NotificationService();
  }

  private generateOrderId(): string {
    this.orderIdCounter += 1;
    return `ORD-${this.orderIdCounter.toString().padStart(6, '0')}`;
  }

  public placeOrder(customerId: string, items: OrderItem[]): Order | null {
    console.log('\n=== PLACING NEW ORDER ===');

    if (!items || items.length === 0) {
      console.log('Error: Order must contain at least one item');
      return null;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!this.paymentService.verifyPaymentMethod(customerId)) {
      console.log('Error: Payment method verification failed');
      return null;
    }

    if (!this.inventoryService.checkAvailability(items)) {
      console.log('Error: Items not available in inventory');
      return null;
    }

    if (!this.paymentService.processPayment(customerId, totalAmount)) {
      console.log('Error: Payment processing failed');
      return null;
    }

    if (!this.inventoryService.reserveItems(items)) {
      console.log('Error: Failed to reserve items');
      this.paymentService.refundPayment(customerId, totalAmount);
      return null;
    }

    const orderId = this.generateOrderId();
    const order = new Order(orderId, customerId, items, totalAmount);
    this.orders.set(orderId, order);

    this.notificationService.sendOrderConfirmation(order);

    console.log(`Order ${orderId} placed successfully!`);
    console.log('=========================\n');

    return order;
  }

  public processOrder(orderId: string): boolean {
    console.log('\n=== PROCESSING ORDER ===');

    const order = this.orders.get(orderId);
    if (!order) {
      console.log(`Error: Order ${orderId} not found`);
      return false;
    }

    try {
      order.process();
      this.notificationService.sendProcessingNotification(order);
      console.log(`Order ${orderId} processed successfully!`);
      console.log('========================\n');
      return true;
    } catch (error) {
      console.log(`Error processing order: ${(error as Error).message}`);
      return false;
    }
  }

  public shipOrder(orderId: string): boolean {
    console.log('\n=== SHIPPING ORDER ===');

    const order = this.orders.get(orderId);
    if (!order) {
      console.log(`Error: Order ${orderId} not found`);
      return false;
    }

    try {
      const trackingNumber = this.shippingService.scheduleShipment(order);
      order.ship();
      this.notificationService.sendShippingNotification(order);

      console.log(`Order ${orderId} shipped successfully with tracking: ${trackingNumber}`);
      console.log('======================\n');
      return true;
    } catch (error) {
      console.log(`Error shipping order: ${(error as Error).message}`);
      return false;
    }
  }

  public deliverOrder(orderId: string): boolean {
    console.log('\n=== DELIVERING ORDER ===');

    const order = this.orders.get(orderId);
    if (!order) {
      console.log(`Error: Order ${orderId} not found`);
      return false;
    }

    try {
      order.deliver();
      this.notificationService.sendDeliveryNotification(order);
      console.log(`Order ${orderId} delivered successfully!`);
      console.log('========================\n');
      return true;
    } catch (error) {
      console.log(`Error delivering order: ${(error as Error).message}`);
      return false;
    }
  }

  public cancelOrder(orderId: string): boolean {
    console.log('\n=== CANCELLING ORDER ===');

    const order = this.orders.get(orderId);
    if (!order) {
      console.log(`Error: Order ${orderId} not found`);
      return false;
    }

    try {
      const previousStatus = order.getStatus();
      order.cancel();

      if (previousStatus === 'NEW' || previousStatus === 'PROCESSING') {
        this.inventoryService.releaseItems(order.getItems());
      }

      this.paymentService.refundPayment(order.getCustomerId(), order.getTotalAmount());
      this.notificationService.sendCancellationNotification(order);

      console.log(`Order ${orderId} cancelled successfully!`);
      console.log('========================\n');
      return true;
    } catch (error) {
      console.log(`Error cancelling order: ${(error as Error).message}`);
      return false;
    }
  }

  public getOrderStatus(orderId: string): string | null {
    const order = this.orders.get(orderId);
    if (!order) {
      console.log(`Order ${orderId} not found`);
      return null;
    }

    const status = order.getStatus();
    console.log(`\nOrder ${orderId} Status: ${status}`);

    if (order.getTrackingNumber()) {
      const trackingInfo = this.shippingService.getShipmentStatus(order.getTrackingNumber()!);
      console.log(`Tracking: ${trackingInfo}`);
    }

    return status;
  }

  public getOrderDetails(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  public getCustomerOrders(customerId: string): Order[] {
    const customerOrders: Order[] = [];
    this.orders.forEach((order) => {
      if (order.getCustomerId() === customerId) {
        customerOrders.push(order);
      }
    });
    return customerOrders;
  }

  public getEstimatedDelivery(orderId: string): Date | null {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }
    return this.shippingService.estimateDeliveryDate();
  }
}
