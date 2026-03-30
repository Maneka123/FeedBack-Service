import request from 'supertest';
import { app } from '../src/index';

describe('Auth middleware', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/feedback/list');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });
});