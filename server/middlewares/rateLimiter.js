import rateLimit from 'express-rate-limit';

// Hindi Comment: General API limiter - API spamming aur DDoS attacks se bachane ke liye standard 15 minute window
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 15 minute me max 300 requests per IP allowed
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Draft-6 RateLimit headers return karta hai (`RateLimit-*`)
  legacyHeaders: false, // `X-RateLimit-*` headers disable kiya
});

// Hindi Comment: Strict Auth Limiter - Brute force password guessing aur credential stuffing attack rokne ke liye
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 minute me max 15 login/register attempts allowed
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Hindi Comment: Booking Rate Limiter - Automated bots dwara fake slot reservations aur slot hoarding rokne ke liye
export const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 10 minute me max 30 booking calls
  message: {
    success: false,
    message: 'Too many booking requests received from this IP. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
