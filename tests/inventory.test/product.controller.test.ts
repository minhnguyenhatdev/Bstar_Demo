import { routerConfig } from './../../src/configs/routerConfig';
import express from 'express';
import request from 'supertest';

const app = express();
routerConfig(app)

describe('Good Home Routes', function () {
  test('responds to /api/product', async () => {
    const res = await request(app).get('/api/product');
    expect(res.header['application/json']).toBe('text/html; charset=utf-8');
    expect(res.body.success).toEqual(true);
  });


});