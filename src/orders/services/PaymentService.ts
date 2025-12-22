export class PaymentService {
  public processPayment(customerId: string, amount: number): boolean {
    console.log(`Processing payment of $${amount.toFixed(2)} for customer ${customerId}`);

    if (amount <= 0) {
      console.log('Payment failed: Invalid amount');
      return false;
    }

    console.log('Payment processed successfully');
    return true;
  }

  public refundPayment(customerId: string, amount: number): boolean {
    console.log(`Processing refund of $${amount.toFixed(2)} for customer ${customerId}`);

    if (amount <= 0) {
      console.log('Refund failed: Invalid amount');
      return false;
    }

    console.log('Refund processed successfully');
    return true;
  }

  public verifyPaymentMethod(customerId: string): boolean {
    console.log(`Verifying payment method for customer ${customerId}`);
    return true;
  }
}
