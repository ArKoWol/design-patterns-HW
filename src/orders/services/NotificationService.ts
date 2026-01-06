import { Order } from '../entities/Order.js';

export class NotificationService {
  public sendOrderConfirmation(order: Order): void {
    console.log(`Sending order confirmation email to customer ${order.getCustomerId()}`);
    console.log(`Order #${order.getId()} confirmed - Total: $${order.getTotalAmount().toFixed(2)}`);
  }

  public sendProcessingNotification(order: Order): void {
    console.log(`Sending processing notification to customer ${order.getCustomerId()}`);
    console.log(`Your order #${order.getId()} is being processed`);
  }

  public sendShippingNotification(order: Order): void {
    console.log(`Sending shipping notification to customer ${order.getCustomerId()}`);
    console.log(`Your order #${order.getId()} has been shipped`);
    if (order.getTrackingNumber()) {
      console.log(`Tracking number: ${order.getTrackingNumber()}`);
    }
  }

  public sendDeliveryNotification(order: Order): void {
    console.log(`Sending delivery notification to customer ${order.getCustomerId()}`);
    console.log(`Your order #${order.getId()} has been delivered`);
  }

  public sendCancellationNotification(order: Order): void {
    console.log(`Sending cancellation notification to customer ${order.getCustomerId()}`);
    console.log(`Your order #${order.getId()} has been cancelled`);
  }
}

