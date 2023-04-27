import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function findBookingByUserId(userId: number) {
  const bookingFromUserId = bookingRepository.findBookingByUserId(userId);

  if (!bookingFromUserId) return notFoundError();

  return bookingFromUserId;
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

  return createdBooking;
}

async function updateBooking(userId: number, roomId: number, bookingIdAsNumber: number) {
  const bookingByUserId = bookingRepository.findBookingByUserId(userId);

  if (!bookingByUserId) throw forbiddenError();

  const roomById = await bookingRepository.findRoomById(roomId);

  if (!roomById) throw notFoundError();

  const bookingWithRoomId = await bookingRepository.findBookingsByRoomId(roomId);

  if (bookingWithRoomId.length === roomById.capacity) throw forbiddenError();

  const updatedBooking = bookingRepository.updateBooking(roomId, bookingIdAsNumber);

  return updatedBooking;
}

const bookingService = {
  findBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingService;
