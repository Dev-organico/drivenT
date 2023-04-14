import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsByUser, getTicketsTypes } from '@/controllers/tickets-controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTicketsByUser)
  .post('/', validateBody());

export { ticketsRouter };
