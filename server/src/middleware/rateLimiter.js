import rateLimit from "express-rate-limit";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10); // 1 min
const max = parseInt(process.env.RATE_LIMIT_MAX || "20", 10); // 20 reqs / min

export const chatRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /*, next */) => {
    // resetTime is a Date when the window resets
    const resetTime = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : null;

    return res.status(429).json({
      message:
        resetTime && resetTime > 0
          ? `You’ve hit the rate limit. Please wait ${resetTime} seconds before trying again.`
          : "You’ve hit the rate limit. Please wait a bit before trying again.",
    });
  },
});
