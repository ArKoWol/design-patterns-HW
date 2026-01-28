import { Order } from '../entities/Order.js';

export class ShippingService {
  private trackingCounter: number;

  constructor() {
    this.trackingCounter = 1000;
  }

  private generateTrackingNumber(): string {
    this.trackingCounter += 1;
    return `TRACK-${this.trackingCounter.toString().padStart(8, '0')}`;
  }

  public calculateShippingCost(order: Order): number {
    return order.getShippingCost();
  }

  public scheduleShipment(order: Order): string {
    console.log(`Scheduling shipment for order ${order.getId()}`);

    const trackingNumber = this.generateTrackingNumber();
    order.setTrackingNumber(trackingNumber);

    const shippingCost = this.calculateShippingCost(order);
    console.log(`Shipment scheduled with tracking number: ${trackingNumber}`);
    console.log(`Shipping cost: $${shippingCost.toFixed(2)}`);

    return trackingNumber;
  }

  public getShipmentStatus(trackingNumber: string): string {
    console.log(`Checking status for tracking number: ${trackingNumber}`);
    return `Package with tracking number ${trackingNumber} is in transit`;
  }

  public estimateDeliveryDate(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate;
  }
}
