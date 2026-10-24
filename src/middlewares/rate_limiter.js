import rateLimit from "express-rate-limit";

// General limiter for the whole API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false, // disable the older X-RateLimit-* headers
});

// Stricter limiter specifically for the login route to prevent brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});
