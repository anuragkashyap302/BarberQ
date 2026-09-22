import request from 'supertest';
import { app } from '../server.js';
import { setupTestDB } from './setup.js';

// In-memory test DB initialize kiya
setupTestDB();

describe('Security Headers & Rate Limiting Suite', () => {
  // ==========================================
  // 1. Helmet Security Headers Test
  // ==========================================
  describe('Helmet HTTP Headers', () => {
    it('Response me Helmet security headers present hone chahiye', async () => {
      // Hindi Comment: Root endpoint pe Helmet security headers check kiya
      const res = await request(app).get('/');

      expect(res.statusCode).toBe(200);

      // X-Content-Type-Options: nosniff header (MIME type sniffing protection)
      expect(res.headers['x-content-type-options']).toBe('nosniff');

      // X-Frame-Options: SAMEORIGIN / DENY (Clickjacking defense)
      expect(res.headers['x-frame-options']).toBeDefined();

      // X-DNS-Prefetch-Control
      expect(res.headers['x-dns-prefetch-control']).toBeDefined();

      // X-Download-Options
      expect(res.headers['x-download-options']).toBe('noopen');
    });
  });

  // ==========================================
  // 2. Rate Limiting Headers & Threshold Enforcement
  // ==========================================
  describe('Rate Limiting Enforcement', () => {
    it('API endpoints pe RateLimit headers return hone chahiye', async () => {
      // Hindi Comment: Rate limiter headers verify kiya
      const res = await request(app).get('/api/barber/list');

      // Draft-6 standard rate limit headers
      expect(res.headers['ratelimit-limit'] || res.headers['x-ratelimit-limit']).toBeDefined();
    });

    it('Auth endpoint pe limit se jyada requests bhejne par HTTP 429 Too Many Requests aana chahiye', async () => {
      // 55 rapid requests bhej kar brute force rate limit trigger kiya
      const requests = [];
      for (let i = 0; i < 55; i++) {
        requests.push(
          request(app)
            .post('/api/user/login')
            .send({ email: 'attacker@example.com', password: 'randompassword' })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.statusCode === 429);

      // Kam se kam ek ya jyada request 429 (Too Many Requests) me rate limit honi chahiye
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      expect(rateLimitedResponses[0].body.success).toBe(false);
      expect(rateLimitedResponses[0].body.message).toMatch(/too many authentication attempts/i);
    });
  });
});
