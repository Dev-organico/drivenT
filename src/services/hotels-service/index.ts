import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function findAllHotels(userId: number) {
  const enrollmentFromUserId = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollmentFromUserId) throw notFoundError();

  const ticketFromEnrollmentId = await ticketsRepository.findTicketByEnrollmentId(enrollmentFromUserId.id);

  if (!ticketFromEnrollmentId) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticketFromEnrollmentId.ticketTypeId);

  if (ticketFromEnrollmentId.status !== 'PAID' || ticketType.includesHotel !== true || ticketType.isRemote === true) {
    throw paymentRequiredError();
  }

  const allHotels = await hotelsRepository.findAllHotels();

  if (allHotels.length === 0) throw notFoundError();

  return allHotels;
}

async function findHotelRoomsByHotelId(hotelId: number, userId: number) {
  const enrollmentFromUserId = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollmentFromUserId) throw notFoundError();

  const ticketFromEnrollmentId = await ticketsRepository.findTicketByEnrollmentId(enrollmentFromUserId.id);

  if (!ticketFromEnrollmentId) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticketFromEnrollmentId.ticketTypeId);

  if (ticketFromEnrollmentId.status !== 'PAID' || ticketType.includesHotel !== true || ticketType.isRemote === true) {
    throw paymentRequiredError();
  }

  const allHotels = await hotelsRepository.findAllHotels();

  if (allHotels.length === 0) throw notFoundError();

  const allRoomsFromChosenHotel = await hotelsRepository.findHotelRoomsByHotelId(hotelId);

  return allRoomsFromChosenHotel;
}

const hotelsService = {
  findAllHotels,
  findHotelRoomsByHotelId,
};

export default hotelsService;
