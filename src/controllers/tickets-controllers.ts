import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const allTickets = await ticketsService.getTicketsTypes();

    return res.status(httpStatus.OK).send(allTickets);
  } catch (error) {
    next(error);
  }
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  try {
    const ticketsByUser = await ticketsService.getTicketsByUser(userId);

    return res.status(httpStatus.OK).send(ticketsByUser);
  } catch (error) {
    next(error);
  }
}
