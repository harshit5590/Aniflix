import rateLimit from 'express-rate-limit';

/**
 * Strict limiter for the MP4 Proxy to prevent massive bandwidth drain
 * Limits to 50 stream initializations per 15 minutes per IP
 */
export const streamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: { error: "Too many stream requests. Please wait before watching more." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Ultra-strict limiter for Auth routes
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again in an hour." }
});