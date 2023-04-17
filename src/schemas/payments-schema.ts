import Joi from 'joi';
import { PaymentIn } from '@/services/payments-service';

export const paymentsSchema = Joi.object<PaymentIn>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
