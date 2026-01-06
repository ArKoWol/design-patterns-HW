/**
 * Comprehensive demonstration of Factory Method, Composite, and Strategy patterns
 * in an order processing system
 */

import { OrderItem } from './components/OrderItem.js';
import { OrderBundle } from './components/OrderBundle.js';
import { StandardOrderFactory } from './factories/StandardOrderFactory.js';
import { ExpressOrderFactory } from './factories/ExpressOrderFactory.js';
import { InternationalOrderFactory } from './factories/InternationalOrderFactory.js';
import { StandardProcessingStrategy } from './strategies/StandardProcessingStrategy.js';
import { ExpressProcessingStrategy } from './strategies/ExpressProcessingStrategy.js';
import { InternationalProcessingStrategy } from './strategies/InternationalProcessingStrategy.js';

/**
 * Demo 1: Composite Pattern
 * Demonstrates creating simple items and complex bundles
 */
export function demoCompositePattern(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║            COMPOSITE PATTERN DEMONSTRATION                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Creating simple order items (Leaf components):\n');

  const laptop = new OrderItem('PROD001', 'Gaming Laptop', 1299.99, 1);
  const mouse = new OrderItem('PROD002', 'Wireless Mouse', 49.99, 1);
  const keyboard = new OrderItem('PROD003', 'Mechanical Keyboard', 129.99, 1);

  console.log(laptop.getDescription());
  console.log(mouse.getDescription());
  console.log(keyboard.getDescription());

  console.log('\n\nCreating a Gaming Bundle (Composite component with 10% discount):\n');

  const gamingBundle = new OrderBundle('Gaming Setup Bundle', 0.10);
  gamingBundle.add(laptop);
  gamingBundle.add(mouse);
  gamingBundle.add(keyboard);

  console.log(gamingBundle.getDescription());

  console.log('\n\nCreating nested bundles:\n');

  const monitor = new OrderItem('PROD004', '4K Monitor', 499.99, 2);
  const hdmiCable = new OrderItem('PROD005', 'HDMI Cable', 19.99, 2);
  
  const displayBundle = new OrderBundle('Display Bundle', 0.05);
  displayBundle.add(monitor);
  displayBundle.add(hdmiCable);

  const completeSetup = new OrderBundle('Complete Gaming Station', 0.15);
  completeSetup.add(gamingBundle);
  completeSetup.add(displayBundle);

  console.log(completeSetup.getDescription());

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

/**
 * Demo 2: Strategy Pattern
 * Demonstrates different processing strategies
 */
export function demoStrategyPattern(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║            STRATEGY PATTERN DEMONSTRATION                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const items = [
    new OrderItem('PROD001', 'Laptop', 999.99, 1),
    new OrderItem('PROD002', 'Mouse', 29.99, 2),
  ];

  console.log('Testing different processing strategies:\n');

  const standardStrategy = new StandardProcessingStrategy();
  console.log(`1. ${standardStrategy.getStrategyName()}`);
  console.log(`   ${standardStrategy.getDescription()}`);
  console.log(`   Shipping Cost: $${standardStrategy.calculateShippingCost(items).toFixed(2)}`);
  console.log(`   Processing Fee: $${standardStrategy.getProcessingFee().toFixed(2)}`);
  console.log(`   Delivery Time: ${standardStrategy.getEstimatedDeliveryDays()} days\n`);

  const expressStrategy = new ExpressProcessingStrategy();
  console.log(`2. ${expressStrategy.getStrategyName()}`);
  console.log(`   ${expressStrategy.getDescription()}`);
  console.log(`   Shipping Cost: $${expressStrategy.calculateShippingCost(items).toFixed(2)}`);
  console.log(`   Processing Fee: $${expressStrategy.getProcessingFee().toFixed(2)}`);
  console.log(`   Delivery Time: ${expressStrategy.getEstimatedDeliveryDays()} days\n`);

  const intlStrategy = new InternationalProcessingStrategy('Canada');
  console.log(`3. ${intlStrategy.getStrategyName()}`);
  console.log(`   ${intlStrategy.getDescription()}`);
  console.log(`   Shipping Cost: $${intlStrategy.calculateShippingCost(items).toFixed(2)}`);
  console.log(`   Processing Fee: $${intlStrategy.getProcessingFee().toFixed(2)}`);
  console.log(`   Delivery Time: ${intlStrategy.getEstimatedDeliveryDays()} days\n`);

  console.log('═══════════════════════════════════════════════════════════\n');
}

/**
 * Demo 3: Factory Method Pattern
 * Demonstrates different order factories
 */
export function demoFactoryMethodPattern(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          FACTORY METHOD PATTERN DEMONSTRATION              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const components = [
    new OrderItem('PROD001', 'Smartphone', 799.99, 1),
    new OrderItem('PROD002', 'Phone Case', 19.99, 1),
  ];

  console.log('Creating orders using different factories:\n');

  console.log('1. Standard Order Factory:\n');
  const standardFactory = new StandardOrderFactory();
  const standardStrategy = new StandardProcessingStrategy();
  const standardOrder = standardFactory.createOrder(
    'ORD-001',
    'CUST-12345',
    components,
    standardStrategy,
  );
  console.log(standardOrder.toString());
  console.log(`   Total: $${standardOrder.getTotalAmount().toFixed(2)}\n`);

  console.log('2. Express Order Factory:\n');
  const expressFactory = new ExpressOrderFactory();
  const expressStrategy = new ExpressProcessingStrategy();
  const expressOrder = expressFactory.createOrder(
    'ORD-002',
    'CUST-12345',
    components,
    expressStrategy,
  );
  console.log(expressOrder.toString());
  console.log(`   Priority: ${expressOrder.isPriority()}`);
  console.log(`   Total: $${expressOrder.getTotalAmount().toFixed(2)}\n`);

  console.log('3. International Order Factory:\n');
  const intlFactory = new InternationalOrderFactory('Germany');
  const intlStrategy = new InternationalProcessingStrategy('Germany');
  const intlOrder = intlFactory.createOrder(
    'ORD-003',
    'CUST-67890',
    components,
    intlStrategy,
  );
  console.log(intlOrder.toString());
  console.log(`   International: ${intlOrder.isInternational()}`);
  console.log(`   Total: $${intlOrder.getTotalAmount().toFixed(2)}\n`);

  console.log('═══════════════════════════════════════════════════════════\n');
}

/**
 * Demo 4: All Patterns Combined
 * Demonstrates all three patterns working together
 */
export function demoAllPatternsCombined(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          ALL PATTERNS COMBINED DEMONSTRATION               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Creating a complex order using all three patterns:\n');

  // COMPOSITE: Build complex order structure
  console.log('Step 1: Building order structure (COMPOSITE PATTERN)\n');
  
  const laptop = new OrderItem('PROD001', 'Gaming Laptop', 1499.99, 1);
  const ram = new OrderItem('PROD002', 'RAM 32GB', 149.99, 2);
  
  const upgradeBundle = new OrderBundle('Performance Upgrade Kit', 0.10);
  upgradeBundle.add(ram);
  
  const accessories = new OrderItem('PROD003', 'Laptop Bag', 49.99, 1);

  const components = [laptop, upgradeBundle, accessories];

  console.log('Order Components:');
  components.forEach((component) => {
    console.log(component.getDescription());
  });

  // STRATEGY: Choose processing strategy
  console.log('\n\nStep 2: Selecting processing strategy (STRATEGY PATTERN)\n');
  
  const strategy = new ExpressProcessingStrategy();
  console.log(`Selected Strategy: ${strategy.getStrategyName()}`);
  console.log(`Description: ${strategy.getDescription()}`);

  // FACTORY METHOD: Create order
  console.log('\n\nStep 3: Creating order using factory (FACTORY METHOD PATTERN)\n');
  
  const factory = new ExpressOrderFactory();
  const order = factory.createOrder(
    'ORD-COMBINED-001',
    'CUST-99999',
    components,
    strategy,
  );

  console.log('\n\nFinal Order Details:\n');
  console.log('─'.repeat(60));
  console.log(order.getDetailedDescription());
  console.log('─'.repeat(60));

  console.log('\n\n✅ All three patterns working together successfully!');
  console.log('   • COMPOSITE: Complex order structure with bundles');
  console.log('   • STRATEGY: Express processing with custom shipping');
  console.log('   • FACTORY METHOD: Express order factory for creation\n');

  console.log('═══════════════════════════════════════════════════════════\n');
}

/**
 * Demo 5: Real-world scenario
 */
export function demoRealWorldScenario(): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              REAL-WORLD SCENARIO DEMONSTRATION             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scenario: International customer orders multiple bundles\n');

  // Create product bundles (Composite)
  const phone = new OrderItem('PROD101', 'Smartphone', 899.99, 1);
  const charger = new OrderItem('PROD102', 'Fast Charger', 29.99, 1);
  const case1 = new OrderItem('PROD103', 'Protective Case', 19.99, 1);

  const phoneBundle = new OrderBundle('Phone Starter Pack', 0.05);
  phoneBundle.add(phone);
  phoneBundle.add(charger);
  phoneBundle.add(case1);

  const headphones = new OrderItem('PROD201', 'Wireless Headphones', 199.99, 1);
  const headphoneCase = new OrderItem('PROD202', 'Headphone Case', 14.99, 1);

  const audioBundle = new OrderBundle('Audio Bundle', 0.08);
  audioBundle.add(headphones);
  audioBundle.add(headphoneCase);

  // Choose strategy for international shipping
  const strategy = new InternationalProcessingStrategy('Japan');

  // Use factory to create order
  const factory = new InternationalOrderFactory('Japan');
  const order = factory.createOrder(
    'ORD-INTL-2025-001',
    'CUST-JP-001',
    [phoneBundle, audioBundle],
    strategy,
  );

  console.log(order.getDetailedDescription());

  console.log('\n\n═══════════════════════════════════════════════════════════\n');
}

/**
 * Run all demonstrations
 */
export function runAllPatternDemos(): void {
  console.log('\n\n');
  console.log('█'.repeat(62));
  console.log('█                                                            █');
  console.log('█        ORDER PROCESSING SYSTEM - PATTERN SHOWCASE         █');
  console.log('█     Factory Method | Composite | Strategy Patterns        █');
  console.log('█                                                            █');
  console.log('█'.repeat(62));

  demoCompositePattern();
  demoStrategyPattern();
  demoFactoryMethodPattern();
  demoAllPatternsCombined();
  demoRealWorldScenario();

  console.log('\n\n');
  console.log('█'.repeat(62));
  console.log('█                                                            █');
  console.log('█              ALL DEMONSTRATIONS COMPLETED                  █');
  console.log('█                                                            █');
  console.log('█'.repeat(62));
  console.log('\n');
}

// Run demos if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllPatternDemos();
}

