import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function findAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;

  try {
    const allHotels = await hotelsService.findAllHotels(userId);

    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    next(error);
  }
}

export async function findHotelRoomsByHotelId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const hotelId = +req.params.hotelId as number;

  const userId = req.userId as number;

  try {
    const allRoomsFromChosenHotel = await hotelsService.findHotelRoomsByHotelId(hotelId, userId);

    return res.status(httpStatus.OK).send(allRoomsFromChosenHotel);
  } catch (error) {
    next(error);
  }
}
