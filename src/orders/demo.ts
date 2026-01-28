import { OrderFacade } from './facade/OrderFacade.js';
import { OrderItem } from './entities/Order.js';

export function demoCompleteOrderLifecycle(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     ORDER MANAGEMENT SYSTEM - COMPLETE LIFECYCLE DEMO      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const facade = new OrderFacade();

  const items: OrderItem[] = [
    {
      productId: 'PROD001',
      productName: 'Gaming Laptop',
      quantity: 1,
      price: 1299.99,
    },
    {
      productId: 'PROD002',
      productName: 'Wireless Mouse',
      quantity: 2,
      price: 49.99,
    },
    {
      productId: 'PROD003',
      productName: 'USB-C Cable',
      quantity: 3,
      price: 19.99,
    },
  ];

  console.log('STEP 1: Placing Order');
  console.log('─'.repeat(60));
  const order = facade.placeOrder('CUST-12345', items);

  if (!order) {
    console.log('Order placement failed!');
    return;
  }

  console.log(`${order.toString()}\n`);

  console.log('STEP 2: Processing Order');
  console.log('─'.repeat(60));
  facade.processOrder(order.getId());
  console.log(`Current Status: ${order.getStatus()}\n`);

  console.log('STEP 3: Shipping Order');
  console.log('─'.repeat(60));
  facade.shipOrder(order.getId());
  console.log(`Current Status: ${order.getStatus()}`);
  console.log(`Tracking Number: ${order.getTrackingNumber()}\n`);

  console.log('STEP 4: Tracking Order');
  console.log('─'.repeat(60));
  facade.getOrderStatus(order.getId());
  const estimatedDelivery = facade.getEstimatedDelivery(order.getId());
  console.log(`Estimated Delivery: ${estimatedDelivery?.toDateString()}\n`);

  console.log('STEP 5: Delivering Order');
  console.log('─'.repeat(60));
  facade.deliverOrder(order.getId());
  console.log(`Final Status: ${order.getStatus()}\n`);

  console.log('═'.repeat(60));
  console.log('Order lifecycle completed successfully!\n');
}

export function demoOrderCancellation(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          ORDER MANAGEMENT SYSTEM - CANCELLATION DEMO       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const facade = new OrderFacade();

  const items: OrderItem[] = [
    {
      productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 999.99,
    },
  ];

  console.log('Placing Order...');
  const order = facade.placeOrder('CUST-67890', items);

  if (!order) {
    console.log('Order placement failed!');
    return;
  }

  console.log('Processing Order...');
  facade.processOrder(order.getId());

  console.log('\nCancelling Order...');
  console.log('─'.repeat(60));
  const cancelled = facade.cancelOrder(order.getId());

  if (cancelled) {
    console.log(`Order ${order.getId()} cancelled successfully`);
    console.log(`Final Status: ${order.getStatus()}\n`);
  }
}

export function demoMultipleOrders(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       ORDER MANAGEMENT SYSTEM - MULTIPLE ORDERS DEMO       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const facade = new OrderFacade();
  const customerId = 'CUST-11111';

  console.log(`Placing Multiple Orders for Customer ${customerId}...`);
  console.log('─'.repeat(60));

  const order1 = facade.placeOrder(customerId, [
    {
      productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 1299.99,
    },
  ]);

  const order2 = facade.placeOrder(customerId, [
    {
      productId: 'PROD002', productName: 'Monitor', quantity: 2, price: 299.99,
    },
  ]);

  const order3 = facade.placeOrder(customerId, [
    {
      productId: 'PROD003', productName: 'Keyboard', quantity: 1, price: 89.99,
    },
  ]);

  if (order1) {
    facade.processOrder(order1.getId());
    facade.shipOrder(order1.getId());
  }

  if (order2) {
    facade.processOrder(order2.getId());
  }

  if (order3) {
  }

  console.log(`\nAll Orders for Customer ${customerId}:`);
  console.log('─'.repeat(60));
  const customerOrders = facade.getCustomerOrders(customerId);

  customerOrders.forEach((order) => {
    console.log(`${order.toString()}`);
  });

  console.log('\nMultiple orders demo completed!\n');
}

export function demoInvalidOperations(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║      ORDER MANAGEMENT SYSTEM - INVALID OPERATIONS DEMO     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const facade = new OrderFacade();

  const items: OrderItem[] = [
    {
      productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 999.99,
    },
  ];

  const order = facade.placeOrder('CUST-99999', items);

  if (!order) {
    return;
  }

  console.log('Attempting Invalid Operations...');
  console.log('─'.repeat(60));

  console.log('\n1. Trying to ship a NEW order (should fail):');
  const shipResult = facade.shipOrder(order.getId());
  console.log(`   Result: ${shipResult ? 'Success' : 'Failed (as expected)'}`);

  console.log('\n2. Processing order first...');
  facade.processOrder(order.getId());

  console.log('\n3. Shipping order...');
  facade.shipOrder(order.getId());

  console.log('\n4. Trying to cancel a SHIPPED order (should fail):');
  const cancelResult = facade.cancelOrder(order.getId());
  console.log(`   Result: ${cancelResult ? 'Success' : 'Failed (as expected)'}`);

  console.log('\n5. Delivering order...');
  facade.deliverOrder(order.getId());

  console.log('\n6. Trying to cancel a DELIVERED order (should fail):');
  const cancelResult2 = facade.cancelOrder(order.getId());
  console.log(`   Result: ${cancelResult2 ? 'Success' : 'Failed (as expected)'}`);

  console.log('\nInvalid operations demo completed!');
  console.log('The State pattern successfully prevented invalid state transitions!\n');
}

export function runAllDemos(): void {
  demoCompleteOrderLifecycle();
  demoOrderCancellation();
  demoMultipleOrders();
  demoInvalidOperations();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos();
}