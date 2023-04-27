import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, findBookingByUserId } from '@/controllers/booking-controllers';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', findBookingByUserId)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/');

export { bookingRouter };
