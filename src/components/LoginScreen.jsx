import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { 
  hasStoredData, 
  loadEncryptedData, 
  saveEncryptedData,
  setSession,
  hashPassword 
} from '../utils/crypto';
import { 
  isLockedOut, 
  getLockoutTimeRemaining, 
  recordFailedAttempt, 
  resetAttempts 
} from '../utils/rateLimit';

const MASTER_PASSWORD_HASH = '29db3ec6eaedbd9def9e162b0119cb451bcccb296158309a2b252ae7d81eef10';

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);


  useEffect(() => {
    if (isLockedOut()) {
      setIsLocked(true);
      const interval = setInterval(() => {
        const remaining = getLockoutTimeRemaining();
        setLockoutTime(remaining);
        if (remaining === 0) {
          setIsLocked(false);
          setError('');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLockedOut()) {
      setError(`LOCKED OUT :: ${lockoutTime}s remaining`);
      return;
    }

    const passwordHash = hashPassword(password);
    
    if (passwordHash !== MASTER_PASSWORD_HASH) {
      const attempts = recordFailedAttempt();
      setError(`ACCESS DENIED :: ${3 - attempts} attempts remaining`);
      
      if (attempts >= 3) {
        setIsLocked(true);
        setError('TOO MANY FAILED ATTEMPTS :: LOCKED FOR 5 MINUTES');
      }
      return;
    }

    if (hasStoredData()) {
      let data = loadEncryptedData(password);

      if (!data) {
        const legacyPasswords = ['password', ''];

        for (const legacyPassword of legacyPasswords) {
          const legacyData = loadEncryptedData(legacyPassword);
          if (legacyData) {
            saveEncryptedData(legacyData, password);
            data = legacyData;
            break;
          }
        }
      }

      if (!data) {
        setError('DECRYPTION FAILED :: WRONG PASSWORD');
        return;
      }
    }

    resetAttempts();
    setSession(password);
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                JSA IT Weekly
              </h1>
              <p className="text-gray-700 text-sm">
                Quarterly Goals Management
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-700 text-sm">
              Team: Maike, Bacha, Johannes, Maxi, Kai
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-gray-900 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-4 py-3"
                placeholder="••••••••"
                disabled={isLocked}
                autoFocus
              />
            </div>

            {error && (
              <div className="border border-red-300 bg-red-50 text-red-800 p-3 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all w-full py-3 text-base"
              disabled={isLocked || !password}
            >
              {isLocked ? `Locked (${lockoutTime}s)` : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-xs text-gray-700">
            <div className="space-y-1">
              <p className="font-semibold">Security Info:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>AES-256 encrypted localStorage</li>
                <li>3 attempts before 5min lockout</li>
                <li>Session expires on tab close</li>
                <li>Default password: "password"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
