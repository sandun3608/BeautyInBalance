// ==========================================
// BEAUTY IN BALANCE - INTELLIGENT CONFIG
// ==========================================

const getApiUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? 'http://localhost:5000' : window.location.origin;
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = `${GLOBAL_API_URL}/api`;

// Export globals
window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config] API Endpoint: ${GLOBAL_API_URL} 🚀`);
