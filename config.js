// ==========================================
// BEAUTY IN BALANCE - INTELLIGENT CONFIG
// ==========================================

const getApiUrl = () => {
  // 1. Check if we're on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // 2. Production or Local File Fallback
  // If we're on the live site, use the origin. 
  // If we're opening local files, use the live Render URL.
  const isLive = window.location.hostname.includes('onrender.com');
  return isLive ? window.location.origin : 'https://beautyinbalance.onrender.com';
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = `${GLOBAL_API_URL}/api`;

// Export globals
window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config] API Endpoint: ${GLOBAL_API_URL} 🚀`);
