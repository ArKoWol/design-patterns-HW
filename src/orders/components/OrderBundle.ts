import { OrderComponent } from './OrderComponent.js';

export class OrderBundle implements OrderComponent {
  private readonly name: string;

  private readonly children: OrderComponent[];

  private readonly discount: number;

  constructor(name: string, discount: number = 0) {
    this.name = name;
    this.children = [];
    this.discount = discount;
  }

  public add(component: OrderComponent): void {
    this.children.push(component);
  }

  public remove(component: OrderComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  public getChildren(): OrderComponent[] {
    return [...this.children];
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    const totalPrice = this.children.reduce((sum, child) => sum + child.getTotalPrice(), 0);
    return totalPrice - (totalPrice * this.discount);
  }

  public getQuantity(): number {
    return 1;
  }

  public getTotalPrice(): number {
    return this.getPrice();
  }

  public getDescription(): string {
    const discount = this.discount > 0 ? ` (${(this.discount * 100).toFixed(0)}% discount)` : '';
    let description = `${this.name}${discount}:\n`;
    this.children.forEach((child) => {
      if (child.isComposite()) {
        description += `  └─ ${child.getDescription().replace(/\n/g, '\n     ')}\n`;
      } else {
        description += `  └─ ${child.getDescription()}\n`;
      }
    });
    description += `  Total: $${this.getTotalPrice().toFixed(2)}`;
    return description;
  }

  public isComposite(): boolean {
    return true;
  }

  public getDiscount(): number {
    return this.discount;
  }
}

