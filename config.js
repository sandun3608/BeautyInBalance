const getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://beautyinbalance.onrender.com';
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = GLOBAL_API_URL + '/api';

window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config v15] API Endpoint: ${BASE_URL} 🚀`);

// Wake up the free-tier Render backend early in the background
if (GLOBAL_API_URL.includes('onrender')) {
    fetch(GLOBAL_API_URL + '/api/products/sample', { method: 'GET', mode: 'no-cors' }).catch(() => {});
}
