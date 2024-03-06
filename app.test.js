const request = require('supertest');
const { app } = require('./server'); // Adjust the path according to your project structure

describe('API Endpoints', () => {
  it('GET / should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Hello World!');
  });

  it('POST /api/users should validate request body', async () => {
    const userData = { email: 'test@example.com', displayName: '' }; // Intentionally missing required fields
    const res = await request(app)
      .post('/api/users')
      .send(userData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Missing required fields');
  });

  it('GET /api/user/:id should handle non-existing users', async () => {
    const userId = 'nonExistingId';
    const res = await request(app).get(`/api/user/${userId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('POST /api/chats/select should handle chat selection or creation', async () => {
    const chatData = { currentUserUid: 'user1', userUid: 'user2' };
    const res = await request(app)
      .post('/api/chats/select')
      .send(chatData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Chat selected or created successfully');
  });

  // Additional tests can be added here
});

