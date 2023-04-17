import Joi from 'joi';

export const paymentsSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required(),
});
