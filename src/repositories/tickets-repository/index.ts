import { Ticket, TicketType } from '@prisma/client';
import enrollmentRepository from '../enrollment-repository';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function getTicketsByUser(enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.findFirst({
    where: { enrollmentId },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function postTicket(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketById(id: number): Promise<Ticket> {
  return await prisma.ticket.findFirst({
    where: {
      id,
    },
  });
}

async function findTicketTypeById(id: number): Promise<TicketType> {
  return await prisma.ticketType.findFirst({
    where: {
      id,
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
  });
}

async function updateTicketStatusById(id: number) {
  await prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getTicketsByUser,
  postTicket,
  findTicketById,
  updateTicketStatusById,
  findTicketTypeById,
  findTicketByEnrollmentId,
};

export default ticketsRepository;
