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

  const bookingId = req.params.bookingId;

  const bookingIdAsNumber = parseFloat(bookingId) as number;

  if (isNaN(bookingIdAsNumber)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send("The 'param' parameter value is not a valid number. Please provide a valid number.");
  }

  try {
    const createdBooking = await bookingService.updateBooking(userId, roomId, bookingIdAsNumber);

    return res.status(httpStatus.OK).send(createdBooking);
  } catch (error) {
    next(error);
  }
}
