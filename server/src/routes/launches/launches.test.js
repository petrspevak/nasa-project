const request = require('supertest');
const app = require('../../app');
/* Jest se requirovat nemusi */

describe('Test GET /launches', () => {
    test('Test response to be 200', async () => {
        await request(app)
            .get('/launches')
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


describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: 'Kepler Exproration X test',
        rocket: 'Explorer IS1 test',
        launchDate: 'December 11, 2035',
        destination: 'Kepler-442 b test',
    };

    const launchDataWithoutDate = {
        mission: 'Kepler Exproration X test',
        rocket: 'Explorer IS1 test',
        destination: 'Kepler-442 b test',
    };

    const launchDataWithInvalidDate = {
        mission: 'Kepler Exproration X test',
        rocket: 'Explorer IS1 test',
        launchDate: '2025-12-36',
        destination: 'Kepler-442 b test',
    };

    test('Test response to be 201 created', async () => {
        const response = await request(app)
            .post('/launches')
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
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect(400)
            .expect('Content-Type', /json/)
        ;

        expect(response.body).toStrictEqual({error: 'Invalid data'});
    });

    test('It should catch invalid date', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400)
            .expect('Content-Type', /json/)
        ;

        expect(response.body).toStrictEqual({error: 'Invalid launch date'});
    });
});