import { notFoundError, requestError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPaymentsFromTicketId(ticketId: number, userId: number) {
  const ticketFromId = await ticketsRepository.findTicketById(ticketId);

  if (!ticketFromId) throw notFoundError();

  const enrollmentFromUserId = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (enrollmentFromUserId.id !== ticketFromId.enrollmentId) throw unauthorizedError();

  const paymentsFromTicketId = await paymentsRepository.getPaymentsFromTicketId(ticketId);

  return paymentsFromTicketId;
}

const paymentsService = {
  getPaymentsFromTicketId,
};

export default paymentsService;

export type PaymentIn = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};
