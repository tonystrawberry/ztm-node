const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe ('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  })

  describe('Test POST /launches', () => {
    const body = { mission: 'France Alpha', rocket: 'EDF', target: 'Kepler-1652 b', launchDate: 'June 24, 2019'};

    test('It should respond with 201 created', async () => {
      const launchData = {... body};
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(201);

        launchData.launchDate = new Date('June 24, 2019');
      expect(response.body).toMatchObject(JSON.parse(JSON.stringify(launchData)));
    });

    test('It should catch missing required properties', async () => {
      const launchData = {... body};
      delete launchData.rocket;

      const response = await request(app)
        .post('/v1/launches')
        .send({ mission: 'France Alpha', target: 'Kepler', launchDate: 'June 24, 2019'})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required properties.',
      });
    });

    test('It should catch invalid dates', async () => {
      const launchData = {... body};

      launchData.launchDate = 'invalid date';
      console.log('launchData', launchData);
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date.',
      });
    });
  });
});
