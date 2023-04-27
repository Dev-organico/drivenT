import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function findBookingByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  try {
    const bookingFromUserId = await bookingService.findBookingByUserId(userId);

    return res.status(httpStatus.OK).send(bookingFromUserId);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  const roomId = req.body.roomId as number;

  try {
    const createdBooking = await bookingService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send(createdBooking);
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  const roomId = req.body.roomId as number;

  const bookingId = +req.params.bookingId as number;

  try {
    const createdBooking = await bookingService.updateBooking(userId, roomId, bookingId);

    return res.status(httpStatus.OK).send(createdBooking);
  } catch (error) {
    next(error);
  }
}
