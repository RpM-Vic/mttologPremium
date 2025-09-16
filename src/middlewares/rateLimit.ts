//rate limit
import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
	windowMs:  1000, // 1 minute
	limit: 20, // Limit each IP to 100 requests per `window`
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: 'Too many requests, please try again later',
	// store: ... , // Redis, Memcached, etc. See below.
})

export const strictLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, 
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: 'Too many requests, please try again later',
	// store: ... , // Redis, Memcached, etc. See below.
})
