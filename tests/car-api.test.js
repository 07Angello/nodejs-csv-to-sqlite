const request = require('supertest');
const app = require('../app');
const moment = require('moment');

/**
 * 
 * TEST CARS ENDPOINTS
 * 
 */

 const mockCarData = {
    UUID: "tttttttt-eeee-ssss-tttt-53905d4538e7",
    VIN: "XYZ4515",
    Make: "Toyota Test",
    Model: "Corolla Test",
    Mileage: 7777.77,
    Year: 2017,
    Price: 77777.77,
    ZipCode: 77777,
    CreateDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
    UpdateDate: moment().format('MMMM Do YYYY, h:mm:ss a')
}

describe('POST /api/cars', () => {
    it('respond with json containing the response of new car with no message error', done => {
        request(app)
            .post('/api/cars')
            .send(mockCarData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201, done);
    });

    it('respond with a bad request due the register is already created', done => {
        request(app)
            .post('/api/cars')
            .send(mockCarData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
    });
});

describe('GET /api/cars', () => {
    it('respond with json containing a list of all cars', done => {
        request(app)
            .get('/api/cars')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /api/cars/:id', () => {
    it('respond with json containing a single register of a car', done => {
        request(app)
            .get(`/api/cars/${ mockCarData.UUID }`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
            .expect({
                Data: [
                    {
                      ...mockCarData
                    }
                  ],
                Message: "",
                OK: true
            });
    });
});

describe('PUT /api/cars/:id', () => {
    mockCarData.Model = 'Camry';
    mockCarData.UpdateDate = moment().format('MMMM Do YYYY, h:mm:ss a');

    it('respond with a json with the updated car registers and no error message', done => {
        request(app)
            .put(`/api/cars/${ mockCarData.UUID }`)
            .send(mockCarData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
            .expect({
                Data: mockCarData,
                Message: '',
                OK: true
            });
    });

    it('respond with a json with a error message not found uuid', done => {
        request(app)
            .put(`/api/cars/TEST-NOT-FOUND-UUID`)
            .send(mockCarData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done)
            .expect({
                Data: null,
                Message: "This ID could not be found.",
                OK: false
            });
    });
});

describe('DELETE /api/cars/:id', () => {
    it('respond with a json with the car information that was deleted.', done => {
        request(app)
            .delete(`/api/cars/${ mockCarData.UUID }`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
            .expect({
                Data: mockCarData,
                Message: '',
                OK: true
            });
    });

    it('respond with a json with the car information that was deleted.', done => {
        request(app)
            .delete(`/api/cars/${ mockCarData.UUID }`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done)
            .expect({
                Data: null,
                Message: 'This ID could not be found.',
                OK: false
            });
    });
});
