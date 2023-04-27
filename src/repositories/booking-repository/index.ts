import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findBookingByUserId(userId: number): Promise<BookingOnlyIdAndRooms> {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoomById(roomId: number): Promise<Room> {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findBookingsByRoomId(roomId: number): Promise<Booking[]> {
  return await prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number): Promise<BookingOnlyId> {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function updateBooking(roomId: number, bookingIdAsNumber: number): Promise<BookingOnlyId> {
  return await prisma.booking.update({
    where: {
      id: bookingIdAsNumber,
    },
    data: {
      roomId,
    },
    select: {
      id: true,
    },
  });
}

type BookingOnlyIdAndRooms = {
  id: number;
  Room: object;
};

type BookingOnlyId = {
  id: number;
};

const bookingRepository = {
  findBookingByUserId,
  findRoomById,
  findBookingsByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
