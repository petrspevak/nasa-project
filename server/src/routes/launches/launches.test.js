require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')
const {loadPlanetsData} = require("../../models/planets.model");
/* Jest se requirovat nemusi */

describe('Test launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    describe('Test GET /v1/launches', () => {
        test('Test response to be 200', async () => {
            await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/)
            ;
        });

        // klasicky test v Jest
        test('Test retyped 1 to be true', () => {
            const value = 1;
            expect(Boolean(value)).toBe(true);
        });
    });


    describe('Test POST /v1/launches', () => {
        const completeLaunchData = {
            mission: 'Kepler Exproration X test',
            rocket: 'Explorer IS1 test',
            launchDate: 'December 11, 2035',
            destination: 'Kepler-442 b',
        };

        const launchDataWithoutDate = {
            mission: 'Kepler Exproration X test',
            rocket: 'Explorer IS1 test',
            destination: 'Kepler-442 b',
        };

        const launchDataWithInvalidDate = {
            mission: 'Kepler Exproration X test',
            rocket: 'Explorer IS1 test',
            launchDate: '2025-12-36',
            destination: 'Kepler-442 b',
        };

        test('Test response to be 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect(201)
                .expect('Content-Type', /json/)
            ;

            expect(response.body).toMatchObject(launchDataWithoutDate);

            const requestDate = new Date(completeLaunchData.launchDate);
            const responseDate = new Date(response.body.launchDate);

            expect(requestDate.valueOf()).toBe(responseDate.valueOf());
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect(400)
                .expect('Content-Type', /json/)
            ;

            expect(response.body).toStrictEqual({error: 'Invalid data'});
        });

        test('It should catch invalid date', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect(400)
                .expect('Content-Type', /json/)
            ;

            expect(response.body).toStrictEqual({error: 'Invalid launch date'});
        });
    });

    afterAll(async () => {
        await mongoDisconnect();
    });
});