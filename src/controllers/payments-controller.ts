import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService, { PaymentIn } from '@/services/payments-service';

export async function getPaymentsFromTicketId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticketId = +req.query.ticketId as number;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  const userId = req.userId as number;

  try {
    const paymentsFromTicketId = await paymentsService.getPaymentsFromTicketId(ticketId, userId);

    return res.status(httpStatus.OK).send(paymentsFromTicketId);
  } catch (error) {
    next(error);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentBody: PaymentIn = req.body;

  const userId = req.userId as number;
}
