class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.maxAttempts = 5;
    this.timeWindow = 5 * 60 * 1000; 
  }

  // Check if request is allowed
  isAllowed(endpoint) {
    const now = Date.now();
    const attempts = this.attempts.get(endpoint) || [];
    
    // Filter attempts within time window
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = recentAttempts[0];
      const waitTime = Math.ceil((this.timeWindow - (now - oldestAttempt)) / 1000 / 60);
      return {
        allowed: false,
        waitTime: waitTime,
        remainingAttempts: 0
      };
    }
    
    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - recentAttempts.length,
      waitTime: 0
    };
  }

  // Record an attempt
  recordAttempt(endpoint) {
    const now = Date.now();
    const attempts = this.attempts.get(endpoint) || [];
    const filteredAttempts = attempts.filter(time => now - time < this.timeWindow);
    filteredAttempts.push(now);
    this.attempts.set(endpoint, filteredAttempts);
  }

  // Reset attempts for an endpoint
  reset(endpoint) {
    this.attempts.delete(endpoint);
  }

  // Get remaining attempts
  getRemainingAttempts(endpoint) {
    const now = Date.now();
    const attempts = this.attempts.get(endpoint) || [];
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

export default new RateLimiter();