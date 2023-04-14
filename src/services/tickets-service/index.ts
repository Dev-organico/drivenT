import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketsTypes() {
  const ticketTypes = await ticketsRepository.getTicketsTypes();

  return ticketTypes;
}

async function getTicketsByUser(userId: number) {
  const enrollmentId = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollmentId) throw notFoundError();

  const ticketTypes = await ticketsRepository.getTicketsByUser(enrollmentId.id);

  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

const ticketsService = {
  getTicketsTypes,
  getTicketsByUser,
};

export default ticketsService;
