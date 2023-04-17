import Joi from 'joi';
import { PaymentIn } from '@/services/payments-service';

export const paymentsSchema = Joi.object<PaymentIn>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required,
    name: Joi.string().required,
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required(),
  }).required(),
});
