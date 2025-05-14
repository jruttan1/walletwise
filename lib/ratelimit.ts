import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
type RateLimitStore = {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
};

const store: RateLimitStore = {};

export interface RateLimitConfig {
  tokensPerInterval: number;  // Maximum requests allowed in the interval
  interval: number;           // Time window in milliseconds
  identifier?: (req: NextRequest) => string; // Function to extract unique identifier
}

export class RateLimiter {
  private store: RateLimitStore;
  private tokensPerInterval: number;
  private interval: number;
  private identifier: (req: NextRequest) => string;

  constructor(config: RateLimitConfig) {
    this.store = store;
    this.tokensPerInterval = config.tokensPerInterval;
    this.interval = config.interval;
    
    // Default identifier uses IP address
    this.identifier = config.identifier || 
      ((req: NextRequest) => {
        const ip = req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  '127.0.0.1';
        return ip;
      });
  }

  async limit(req: NextRequest): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const key = this.identifier(req);
    const now = Date.now();
    
    // Initialize if this is the first request from this identifier
    if (!this.store[key]) {
      this.store[key] = {
        tokens: this.tokensPerInterval,
        lastRefill: now
      };
    }
    
    const record = this.store[key];
    const elapsedTime = now - record.lastRefill;
    
    // Refill tokens based on elapsed time (token bucket algorithm)
    if (elapsedTime > 0) {
      const tokensToAdd = Math.floor(elapsedTime / this.interval) * this.tokensPerInterval;
      if (tokensToAdd > 0) {
        record.tokens = Math.min(this.tokensPerInterval, record.tokens + tokensToAdd);
        record.lastRefill = now;
      }
    }
    
    // Calculate time until next token refresh
    const remainingTime = this.interval - (now - record.lastRefill) % this.interval;
    const resetTime = now + remainingTime;
    
    // Check if we have tokens left
    const hasToken = record.tokens > 0;
    if (hasToken) {
      record.tokens -= 1;
    }
    
    return {
      success: hasToken,
      limit: this.tokensPerInterval,
      remaining: record.tokens,
      reset: resetTime
    };
  }
}

/**
 * Middleware factory for rate limiting API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);
  
  return async function rateLimit(req: NextRequest) {
    const result = await limiter.limit(req);
    
    // If rate limit exceeded, return 429 Too Many Requests
    if (!result.success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
        }
      });
    }
    
    // Continue to the API route
    return null;
  };
}

// Example usage:
/*
export const rateLimit = withRateLimit({
  tokensPerInterval: 10,   // 10 requests
  interval: 60 * 1000,     // per minute
});

// In your API route:
export async function GET(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Continue with your API logic...
}
*/
