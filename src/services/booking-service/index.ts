import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function findBookingByUserId(userId: number) {
  const bookingByUserId = await bookingRepository.findBookingByUserId(userId);

  if (!bookingByUserId) throw notFoundError();

  return bookingByUserId;
}

async function createBooking(userId: number, roomId: number) {
  const enrollmentFromUserId = await enrollmentRepository.findEnrollmentByUserId(userId);

  const ticketFromEnrollmentId = await ticketsRepository.findTicketByEnrollmentId(enrollmentFromUserId.id);

  const ticketType = await ticketsRepository.findTicketTypeById(ticketFromEnrollmentId.ticketTypeId);

  if (ticketFromEnrollmentId.status !== 'PAID' || ticketType.includesHotel !== true || ticketType.isRemote === true) {
    throw forbiddenError();
  }

  const roomById = await bookingRepository.findRoomById(roomId);

  if (!roomById) throw notFoundError();

  const bookingWithRoomId = await bookingRepository.findBookingsByRoomId(roomId);

  if (bookingWithRoomId.length === roomById.capacity) throw forbiddenError();

  const createdBooking = await bookingRepository.createBooking(userId, roomId);

  return {
    bookingId: createdBooking.id,
  };
}

async function updateBooking(userId: number, roomId: number, bookingIdAsNumber: number) {
  const bookingByUserId = await bookingRepository.findBookingByUserId(userId);

  if (!bookingByUserId) throw forbiddenError();

  const roomById = await bookingRepository.findRoomById(roomId);

  if (!roomById) throw notFoundError();

  const bookingWithRoomId = await bookingRepository.findBookingsByRoomId(roomId);

  if (bookingWithRoomId.length === roomById.capacity) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(roomId, bookingIdAsNumber);

  return {
    bookingId: updatedBooking.id,
  };
}

const bookingService = {
  findBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingService;
