const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000;
const ATTEMPT_KEY = 'jsa_login_attempts';
const LOCKOUT_KEY = 'jsa_lockout_until';

export const recordFailedAttempt = () => {
  const attempts = getFailedAttempts() + 1;
  localStorage.setItem(ATTEMPT_KEY, attempts.toString());
  
  if (attempts >= MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION;
    localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
  }
  
  return attempts;
};

export const getFailedAttempts = () => {
  const attempts = localStorage.getItem(ATTEMPT_KEY);
  return attempts ? parseInt(attempts, 10) : 0;
};

export const resetAttempts = () => {
  localStorage.removeItem(ATTEMPT_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
};

export const isLockedOut = () => {
  const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
  if (!lockoutUntil) return false;
  
  const until = parseInt(lockoutUntil, 10);
  if (Date.now() < until) {
    return true;
  }
  
  resetAttempts();
  return false;
};

export const getLockoutTimeRemaining = () => {
  const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
  if (!lockoutUntil) return 0;
  
  const until = parseInt(lockoutUntil, 10);
  const remaining = Math.max(0, until - Date.now());
  return Math.ceil(remaining / 1000);
};
