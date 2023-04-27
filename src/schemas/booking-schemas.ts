import Joi from 'joi';

export const bookingSchema = Joi.object<BookingIn>({
  roomId: Joi.number().required(),
});

type BookingIn = {
  roomId: number;
};
