import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createUser, createTicket } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEmptyRoom,
  createHotel,
  createIsIncludedHotelFalseTicketType,
  createIsIncludedHotelTrueTicketType,
  createIsRemoteTrueTicketType,
  createRoom,
  createSmallRoom,
} from '../factories/hotels-factory';
import { createBookingTest } from '../factories/booking-factory';
import app, { init } from '@/app';
import { BookingOnlyId, BookingOnlyIdAndRooms } from '@/repositories/booking-repository';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and return bookingId', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRomm = await createRoom(createdHotel.id);
      const token = await generateValidToken(user);
      await createBookingTest(user.id, createdRomm.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      const responseBody = response.body as BookingOnlyIdAndRooms;

      expect(response.status).toEqual(httpStatus.OK);

      expect(responseBody).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        }),
      );
    });

    it('should respond with status 404 if user dont have a booking', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and return bookingId', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRomm = await createRoom(createdHotel.id);
      const token = await generateValidToken(user);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRomm.id });

      const responseBody = response.body as BookingOnlyId;

      expect(response.status).toEqual(httpStatus.OK);

      expect(responseBody).toEqual(
        expect.objectContaining({
          bookingId: expect.any(Number),
        }),
      );
    });

    it('should respond with status 403 if ticket wasnt paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'RESERVED');

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsRemoteTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticketType doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelFalseTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room doesnt exists', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const token = await generateValidToken(user);

      const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 0 });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if room is full', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRoom = await createSmallRoom(createdHotel.id);
      await createBookingTest(user.id, createdRoom.id);
      const token = await generateValidToken(user);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT /booking/:bokingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/tickets/types');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and return bookingId', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRoom = await createSmallRoom(createdHotel.id);
      const createdSmallRoom = await createSmallRoom(createdHotel.id);
      const createdBooking = await createBookingTest(user.id, createdRoom.id);
      const token = await generateValidToken(user);

      const response = await server
        .put(`/booking/${String(createdBooking.id)}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdSmallRoom.id });

      const responseBody = response.body as BookingOnlyId;

      expect(response.status).toEqual(httpStatus.OK);

      expect(responseBody).toEqual(
        expect.objectContaining({
          bookingId: expect.any(Number),
        }),
      );
    });

    it('should respond with status 404 if room doesnt exists', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRomm = await createRoom(createdHotel.id);
      const token = await generateValidToken(user);
      const createdBooking = await createBookingTest(user.id, createdRomm.id);

      const response = await server
        .put(`/booking/${String(createdBooking.id)}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: 0 });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if user dont have a booking', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const token = await generateValidToken(user);

      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room is full', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      const createdRoom = await createSmallRoom(createdHotel.id);
      const createdEmptyRoom = await createEmptyRoom(createdHotel.id);
      const createdBooking = await createBookingTest(user.id, createdRoom.id);
      const token = await generateValidToken(user);

      const response = await server
        .put(`/booking/${String(createdBooking.id)}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdEmptyRoom.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 400 if param bookingId in not a number', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.put(`/booking/a`).set('Authorization', `Bearer ${token}`).send({ roomId: 0 });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
  });
});
