import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService, { TicketIn } from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const allTickets = await ticketsService.getTicketsTypes();

  return res.status(httpStatus.OK).send(allTickets);
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  try {
    const ticketsByUser = await ticketsService.getTicketsByUser(userId);

    return res.status(httpStatus.OK).send(ticketsByUser);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  const { ticketTypeId }: TicketIn = req.body;

  try {
    const ticketByUser = await ticketsService.postTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticketByUser);
  } catch {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
