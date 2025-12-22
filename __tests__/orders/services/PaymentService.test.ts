import { PaymentService } from '../../../src/orders/services/PaymentService';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('processPayment', () => {
    it('should process valid payment successfully', () => {
      const result = paymentService.processPayment('CUST-001', 100.00);
      expect(result).toBe(true);
    });

    it('should fail for zero amount', () => {
      const result = paymentService.processPayment('CUST-001', 0);
      expect(result).toBe(false);
    });

    it('should fail for negative amount', () => {
      const result = paymentService.processPayment('CUST-001', -50);
      expect(result).toBe(false);
    });
  });

  describe('refundPayment', () => {
    it('should process valid refund successfully', () => {
      const result = paymentService.refundPayment('CUST-001', 100.00);
      expect(result).toBe(true);
    });

    it('should fail for zero amount', () => {
      const result = paymentService.refundPayment('CUST-001', 0);
      expect(result).toBe(false);
    });

    it('should fail for negative amount', () => {
      const result = paymentService.refundPayment('CUST-001', -50);
      expect(result).toBe(false);
    });
  });

  describe('verifyPaymentMethod', () => {
    it('should verify payment method successfully', () => {
      const result = paymentService.verifyPaymentMethod('CUST-001');
      expect(result).toBe(true);
    });
  });
});

