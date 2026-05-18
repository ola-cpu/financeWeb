import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('DashboardSummary (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users/:id/dashboard-summary (GET)', async () => {
    const userRepository = app.get('UserRepository');
    await userRepository.save({
      id: 1,
      email: 'arkad@babylon.com',
      password: 'gold',
      name: 'Arkad',
    });

    return request(app.getHttpServer())
      .get('/users/1/dashboard-summary')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('netWorth');
        expect(res.body).toHaveProperty('healthScore');
        expect(res.body).toHaveProperty('charts');
        expect(res.body.charts).toHaveProperty('incomeVsExpense');
      });
  });
});
