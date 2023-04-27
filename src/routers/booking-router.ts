import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, findBookingByUserId, updateBooking } from '@/controllers/booking-controllers';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', findBookingByUserId)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingRouter };
