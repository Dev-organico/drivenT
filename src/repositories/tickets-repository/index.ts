import { Ticket, TicketType } from '@prisma/client';
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

const ticketsRepository = {
  getTicketsTypes,
  getTicketsByUser,
  postTicket,
};

export default ticketsRepository;
