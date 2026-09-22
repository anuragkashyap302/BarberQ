import request from 'supertest';
import { app } from '../server.js';
import { setupTestDB } from './setup.js';
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// In-memory test DB initialize kiya
setupTestDB();

describe('User Authentication & Authorization Suite', () => {
  const mockUser = {
    name: 'Rahul Sharma',
    email: 'rahul.test@example.com',
    password: 'password123',
  };

  // ==========================================
  // 1. User Registration Tests
  // ==========================================
  describe('POST /api/user/register', () => {
    it('Naye user ko successfully register karna chahiye aur JWT token return karna chahiye', async () => {
      // Hindi Comment: Valid user payload bhej kar registration test kiya
      const res = await request(app)
        .post('/api/user/register')
        .send(mockUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();

      // Database me user save hua ya nahi verify kiya
      const userInDb = await UserModel.findOne({ email: mockUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb.name).toBe(mockUser.name);
    });

    it('Missing details hone par validation error return karna chahiye', async () => {
      // Hindi Comment: Missing name payload test kiya
      const res = await request(app)
        .post('/api/user/register')
        .send({
          email: 'missingname@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/missing/i);
    });

    it('Invalid email format hone par error return karna chahiye', async () => {
      // Hindi Comment: Invalid email string test kiya
      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Invalid Email',
          email: 'invalid-email-format',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/valid/i);
    });

    it('6 characters se chhota password hone par error return karna chahiye', async () => {
      // Hindi Comment: Weak password test kiya
      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Weak Pass',
          email: 'weakpass@example.com',
          password: '123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/strong password/i);
    });
  });

  // ==========================================
  // 2. User Login Tests
  // ==========================================
  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      // Test user pehle se register kiya login test ke liye
      await request(app).post('/api/user/register').send(mockUser);
    });

    it('Valid credentials ke sath successfully login hona chahiye', async () => {
      // Hindi Comment: Correct email aur password ke sath login request kiya
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('Galat password hone par login reject hona chahiye', async () => {
      // Hindi Comment: Wrong password test kiya
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('Non-existent user email ke sath error message aana chahiye', async () => {
      // Hindi Comment: Aisa email jo DB me nahi hai
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/does not exist/i);
    });
  });

  // ==========================================
  // 3. Auth Guard Middleware Tests
  // ==========================================
  describe('Protected Route Guard: GET /api/user/get-profile', () => {
    it('Bina token ke protected route access karne par unauthorized error milna chahiye', async () => {
      // Hindi Comment: Header me token nahi pass kiya
      const res = await request(app).get('/api/user/get-profile');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/unauthorized|token/i);
    });

    it('Invalid/Tampered token pass karne par request reject honi chahiye', async () => {
      // Hindi Comment: Fake ya corrupted token pass kiya
      const res = await request(app)
        .get('/api/user/get-profile')
        .set('token', 'invalid_fake_jwt_token_xyz');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
    });

    it('Valid token ke sath user profile data return hona chahiye', async () => {
      // Valid register karke mila token pass kiya
      const regRes = await request(app).post('/api/user/register').send(mockUser);
      const token = regRes.body.token;

      const profileRes = await request(app)
        .get('/api/user/get-profile')
        .set('token', token);

      expect(profileRes.statusCode).toBe(200);
      expect(profileRes.body.success).toBe(true);
      expect(profileRes.body.userData).toBeDefined();
      expect(profileRes.body.userData.email).toBe(mockUser.email);
      // Password return nahi hona chahiye security ke liye
      expect(profileRes.body.userData.password).toBeUndefined();
    });
  });

  // ==========================================
  // 4. Forgot Password Tests
  // ==========================================
  describe('POST /api/user/forgot-password', () => {
    beforeEach(async () => {
      await request(app).post('/api/user/register').send(mockUser);
    });

    it('Existing user ka password successfully update hona chahiye aur naye password se login hona chahiye', async () => {
      const newPassword = 'newSecretPassword123';
      const res = await request(app)
        .post('/api/user/forgot-password')
        .send({
          email: mockUser.email,
          newPassword,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/updated successfully/i);

      // Verify ki ab user naye password se login kar sakta hai
      const loginRes = await request(app)
        .post('/api/user/login')
        .send({
          email: mockUser.email,
          password: newPassword,
        });

      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.token).toBeDefined();
    });

    it('Non-existent email hone par error message return karna chahiye', async () => {
      const res = await request(app)
        .post('/api/user/forgot-password')
        .send({
          email: 'unknown@example.com',
          newPassword: 'newPassword123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/no account found/i);
    });
  });
});
