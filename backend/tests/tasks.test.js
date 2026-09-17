const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { connectTestDB, disconnectTestDB } = require('./setup');

process.env.JWT_SECRET = 'test-jwt-secret';

let app;

describe('Task routes', () => {
  let token;
  let otherToken;
  let taskId;

  before(async () => {
    await connectTestDB();
    app = require('../server');

    const userA = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User A', email: 'a@example.com', password: 'secret12' });

    token = userA.body.token;

    const userB = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User B', email: 'b@example.com', password: 'secret12' });

    otherToken = userB.body.token;
  });

  after(async () => {
    await disconnectTestDB();
  });

  it('rejects unauthenticated task access', async () => {
    const res = await request(app).get('/api/tasks');
    assert.equal(res.status, 401);
  });

  it('creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My task', description: 'Details', priority: 'HIGH' });

    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'My task');
    taskId = res.body._id;
  });

  it('lists tasks scoped to the authenticated user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });

  it('does not expose another user tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${otherToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

  it('updates a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'IN_PROGRESS');
  });

  it('deletes a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
  });
});
