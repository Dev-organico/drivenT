import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentIn } from '@/services/payments-service';

async function getPaymentsFromTicketId(ticketId: number): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createNewPayment(paymentBody: PaymentIn, value: number): Promise<Payment> {
  const cardNumberAsString = String(paymentBody.cardData.number);

  return await prisma.payment.create({
    data: {
      ticketId: paymentBody.ticketId,
      value,
      cardIssuer: paymentBody.cardData.issuer,
      cardLastDigits: cardNumberAsString.slice(-4),
    },
  });
}

const paymentsRepository = {
  getPaymentsFromTicketId,
  createNewPayment,
};

export default paymentsRepository;
