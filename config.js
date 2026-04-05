// ==========================================
// BEAUTY IN BALANCE - SMART CONFIGURATION
// ==========================================

const getApiUrl = () => {
  // If we're on localhost, use the local server
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Otherwise, use the deployed Render server
  // YOU CAN MANUALLY CHANGE THIS TO YOUR RENDER URL BELOW
  return 'https://beautyinbalance.onrender.com';
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = `${GLOBAL_API_URL}/api`;

// Export values globally so they're accessible everywhere
window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config] API Target: ${GLOBAL_API_URL} 🚀`);
