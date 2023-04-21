import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findAllHotels, findHotelRoomsByHotelId } from '@/controllers/hotels-controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', findAllHotels).get('/:hotelId', findHotelRoomsByHotelId);

export { hotelsRouter };
