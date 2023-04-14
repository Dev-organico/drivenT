import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsByUser, getTicketsTypes, postTicket } from '@/controllers/tickets-controllers';
import { ticketsSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTicketsByUser)
  .post('/', validateBody(ticketsSchema), postTicket);

export { ticketsRouter };
