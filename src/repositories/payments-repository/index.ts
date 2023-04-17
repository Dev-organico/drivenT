import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function getPaymentsFromTicketId(ticketId: number): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentsRepository = {
  getPaymentsFromTicketId,
};

export default paymentsRepository;
