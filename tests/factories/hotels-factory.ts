import faker from '@faker-js/faker';
import { Hotel, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createIsIncludedHotelTrueTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createIsIncludedHotelFalseTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
    },
  });
}

export async function createIsRemoteTrueTrueTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: false,
    },
  });
}

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: 'johnPalace',
      image: 'http://',
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: 'bigRoom',
      capacity: 4,
      hotelId,
    },
  });
}
