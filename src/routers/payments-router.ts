import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createNewPayment, getPaymentsFromTicketId } from '@/controllers/payments-controller';
import { paymentsSchema } from '@/schemas/payments-schema';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentsFromTicketId)
  .post('/process', validateBody(paymentsSchema), createNewPayment);

export { paymentsRouter };
