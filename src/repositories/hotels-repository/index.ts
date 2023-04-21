import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

async function findHotelRoomsByHotelId(hotelId: number): Promise<Hotel> {
  return await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  findAllHotels,
  findHotelRoomsByHotelId,
};

export default hotelsRepository;
