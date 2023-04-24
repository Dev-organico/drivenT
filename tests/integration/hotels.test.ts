import faker from '@faker-js/faker';
import { Hotel } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createHotel,
  createIsIncludedHotelFalseTicketType,
  createIsIncludedHotelTrueTicketType,
  createIsRemoteTrueTrueTicketType,
  createRoom,
} from '../factories/hotels-factory';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
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
    it('should respond with status 200 if return all hotels', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      await createHotel();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      const responseBody = response.body as Hotel[];

      expect(response.status).toEqual(httpStatus.OK);

      expect(responseBody).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });

    it('should respond with status 404 if enrollment doesnt exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if ticket doesnt exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if hotel doesnt exists', async () => {
      await prisma.hotel.deleteMany({});
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket wasnt paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'RESERVED');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsRemoteTrueTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticketType doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelFalseTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
  });
});

describe('GET /hotels/rooms', () => {
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
    it('should respond with status 200 if return all hotels with rooms', async () => {
      const user = await createUser();
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');
      const createdHotel = await createHotel();
      await createRoom(createdHotel.id);
      const token = await generateValidToken(user);

      const response = await server.get(`/hotels/${String(createdHotel.id)}`).set('Authorization', `Bearer ${token}`);

      const responseBody = response.body as Hotel;

      expect(response.status).toEqual(httpStatus.OK);

      expect(responseBody).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
      );
    });

    it('should respond with status 404 if enrollment doesnt exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if ticket doesnt exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if hotel doesnt exists', async () => {
      await prisma.room.deleteMany({});
      await prisma.hotel.deleteMany({});
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket wasnt paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'RESERVED');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsRemoteTrueTrueTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticketType doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdEnrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createIsIncludedHotelFalseTicketType();
      await createTicket(createdEnrollment.id, ticketType.id, 'PAID');

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
  });
});

async () => {
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
};
