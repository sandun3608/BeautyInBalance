// ==========================================
// BEAUTY IN BALANCE - INTELLIGENT CONFIG
// ==========================================

const getApiUrl = () => {
  // 1. Check if we're on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // 2. For Production: Use a relative path if possible or fallback to detected origin
  // If the frontend is hosted on the same Render service as the API, /api just works.
  // Otherwise, fallback to the current origin on Render.
  return window.location.origin;
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = `${GLOBAL_API_URL}/api`;

// Export globals
window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config] API Endpoint: ${GLOBAL_API_URL} 🚀`);
