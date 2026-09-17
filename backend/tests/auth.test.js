const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { connectTestDB, disconnectTestDB } = require('./setup');

process.env.JWT_SECRET = 'test-jwt-secret';

let app;

describe('Auth routes', () => {
  before(async () => {
    await connectTestDB();
    app = require('../server');
  });

  after(async () => {
    await disconnectTestDB();
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'secret12' });

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'test@example.com');
  });

  it('rejects duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'secret12' });

    assert.equal(res.status, 409);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'secret12' });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    assert.equal(res.status, 401);
  });

  it('returns current user for /me', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'secret12' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, 'test@example.com');
  });
});
