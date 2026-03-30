import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/index';
import Feedback from '../src/models/feedback.model';

jest.mock('../src/services/gemini.service', () => ({
  analyzeFeedback: jest.fn().mockResolvedValue({
    category: 'Bug',
    sentiment: 'Positive',
    priority_score: 2,
    summary: 'Test summary',
    tags: [],
  }),
}));

beforeAll(async () => {
  await Feedback.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/feedback', () => {
  it('saves valid feedback and triggers AI', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Test Feedback',
        description: 'This is a test description with enough length',
        category: 'Bug',
        submitterName: 'Tester',
        submitterEmail: 'test@test.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ai_category).toBe('Bug');
    expect(res.body.data.ai_summary).toBe('Test summary');
  });

  it('rejects empty title', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: '',
        description: 'This is a valid description but no title',
        category: 'Bug',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid title/i); // ✅ FIXED
  });
});

describe('PATCH /api/feedback/:id', () => {
  it('updates status correctly', async () => {
    // ✅ Create fresh data inside test (FIXED)
    const fb = await Feedback.create({
      title: 'Patch Test',
      description: 'This is a valid description for updating status',
      category: 'Feature Request',
      status: 'New',
    });

    const res = await request(app)
      .patch(`/api/feedback/${fb._id}`)
      .send({ status: 'Resolved' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Resolved');
  });
});