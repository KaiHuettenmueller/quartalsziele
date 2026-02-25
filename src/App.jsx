import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { isSessionActive, getSessionPassword, clearSession } from './utils/crypto';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isSessionActive()) {
      const sessionPassword = getSessionPassword();
      if (sessionPassword) {
        setPassword(sessionPassword);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (pass) => {
    setPassword(pass);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearSession();
    setPassword('');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard password={password} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
