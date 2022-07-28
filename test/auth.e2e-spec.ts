import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/signup', () => {
    it('handles a signup request', async () => {
      const testEmail = 'e2e1@email.com';

      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: testEmail, password: 'e2e123' })
        .expect(201);

      const { id, email } = res.body;
      expect(id).toBeDefined();
      expect(email).toEqual(testEmail);
    });

    it('sign as a new user then get the currently logged in user', async () => {
      const testEmail = 'e2e2@email.com';

      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: testEmail, password: 'e2e123' })
        .expect(201);

      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200);

      expect(body.email).toEqual(testEmail);
    });
  });

  describe('/auth/signin', () => {});
});
