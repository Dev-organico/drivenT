import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketsTypes() {
  const ticketTypes = await ticketsRepository.getTicketsTypes();

  return ticketTypes;
}

async function getTicketsByUser(userId: number) {
  let enrollmentId;

  try {
    enrollmentId = await findEnrollmentByUserId(userId);
  } catch (error) {
    throw error;
  }

  const ticketTypes = await ticketsRepository.getTicketsByUser(enrollmentId);

  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function findEnrollmentByUserId(userId: number) {
  const enrollmentId = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollmentId) throw notFoundError();

  return enrollmentId.id;
}

async function postTicket(userId: number, ticketTypeId: number) {
  let enrollmentId;

  try {
    enrollmentId = await findEnrollmentByUserId(userId);
  } catch (error) {
    throw error;
  }

  const ticketByUser = await ticketsRepository.postTicket(ticketTypeId, enrollmentId);

  return ticketByUser;
}

const ticketsService = {
  getTicketsTypes,
  getTicketsByUser,
  postTicket,
};

export default ticketsService;

export type TicketIn = {
  ticketTypeId: number;
};
