/**
 * Composite Pattern - Component Interface
 * Base interface for all order components
 */
export interface OrderComponent {
  getName(): string;
  getPrice(): number;
  getQuantity(): number;
  getTotalPrice(): number;
  getDescription(): string;
  isComposite(): boolean;
  getChildren?(): OrderComponent[];
}

