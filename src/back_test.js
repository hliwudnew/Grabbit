const request = require('supertest');
const app = require('./back'); // Ensure back.js exports 'app'

describe('GET /api/items', () => {
    test('should return filtered items based on query', async () => {
        const response = await request(app).get('/api/items?query=laptop');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should filter items by minPrice and maxPrice', async () => {
        const response = await request(app).get('/api/items?minPrice=100&maxPrice=300');
        expect(response.status).toBe(200);
        response.body.data.forEach(item => {
            expect(item.price).toBeGreaterThanOrEqual(100);
            expect(item.price).toBeLessThanOrEqual(300);
        });
    });

    test('should sort items by price in ascending order', async () => {
        const response = await request(app).get('/api/items?sort=price_asc');
        expect(response.status).toBe(200);
        const prices = response.body.data.map(item => item.price);
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
});
