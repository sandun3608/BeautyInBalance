// ==========================================
// BEAUTY IN BALANCE - INTELLIGENT CONFIG
// ==========================================

const getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://beautyinbalance.onrender.com';
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = `${GLOBAL_API_URL}/api`;

// Export globals
window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config] API Endpoint: ${GLOBAL_API_URL} 🚀`);
