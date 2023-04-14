import Joi from 'joi';
import { TicketIn } from '@/services/tickets-service';

export const ticketsSchema = Joi.object<TicketIn>({
  ticketTypeId: Joi.number().required(),
});
