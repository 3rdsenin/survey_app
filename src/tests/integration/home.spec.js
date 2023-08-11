const request = require('supertest')

const app = require('../../../index');

describe('Home routes', () => {


    it('should return resourse not found', async() => {
        const response = await request(app).post('/');

        expect(response.status).toBe(404);
    })

    it('should return resourse not found', async() => {
        const response = await request(app).get('/');

        expect(response.status).toBe(404);
    })
})