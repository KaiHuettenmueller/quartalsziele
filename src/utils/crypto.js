import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'jsa_quarterly_goals_encrypted';
const SESSION_KEY = 'jsa_session_active';
const SESSION_PASSWORD_KEY = 'jsa_session_password';

export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const encryptData = (data, password) => {
  const key = hashPassword(password);
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decryptData = (encryptedData, password) => {
  try {
    const key = hashPassword(password);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
};

export const saveEncryptedData = (data, password) => {
  const encrypted = encryptData(data, password);
  localStorage.setItem(STORAGE_KEY, encrypted);
};

export const loadEncryptedData = (password) => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;
  return decryptData(encrypted, password);
};

export const hasStoredData = () => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const setSession = (password) => {
  sessionStorage.setItem(SESSION_KEY, 'true');
  if (password) {
    sessionStorage.setItem(SESSION_PASSWORD_KEY, password);
  }
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_PASSWORD_KEY);
};

export const isSessionActive = () => {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
};

export const getSessionPassword = () => {
  return sessionStorage.getItem(SESSION_PASSWORD_KEY) || '';
};

export const exportData = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jsa-quarterly-goals-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      callback(data, null);
    } catch (error) {
      callback(null, 'Invalid JSON file');
    }
  };
  reader.readAsText(file);
};
