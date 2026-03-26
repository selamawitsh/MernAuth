let failedAttempts = []; 
const MAX_ATTEMPTS = 5; 
const TIME_WINDOW = 5 * 60 * 1000; 

// Get attempts from last 5 minutes
function getRecentAttempts() {
  const now = Date.now();
  return failedAttempts.filter(time => now - time < TIME_WINDOW);
}

// Check if user can try to login/register
export function canTry() {
  const recentAttempts = getRecentAttempts();
  
  // If 5 or more attempts in last 5 minutes, block
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const oldestAttempt = Math.min(...recentAttempts);
    const now = Date.now();
    const timePassed = now - oldestAttempt;
    const timeRemaining = TIME_WINDOW - timePassed;
    const minutesLeft = Math.ceil(timeRemaining / 1000 / 60);
    
    return {
      allowed: false,
      waitMinutes: minutesLeft,
      remaining: 0
    };
  }
  
  // User can try
  return {
    allowed: true,
    waitMinutes: 0,
    remaining: MAX_ATTEMPTS - recentAttempts.length
  };
}

// Record a failed attempt
export function recordFailedAttempt() {
  const now = Date.now();
  const recentAttempts = getRecentAttempts();
  recentAttempts.push(now);
  failedAttempts = recentAttempts;
}

// Reset attempts (when login succeeds)
export function resetAttempts() {
  failedAttempts = [];
}

// Get remaining attempts count
export function getRemainingAttempts() {
  const recentAttempts = getRecentAttempts();
  return Math.max(0, MAX_ATTEMPTS - recentAttempts.length);
}