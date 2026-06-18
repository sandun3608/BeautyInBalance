const axios = require('axios');
const crypto = require('crypto');
const KOKO_MERCHANT_ID = 'f189fb3e92507eb60dced60bf2b3b93a';
const KOKO_API_KEY = 'fg419Ly0dJfcZV4XYtjewwPnwtbOoPbO';
const BASE_URL = 'https://prodapi.paykoko.com';

const amount = '100.00';
const currency = 'LKR';
const pluginName = 'customapi';
const pluginVersion = '1.0.1';
const randomStr = Math.random().toString(36).substring(2, 10);
const kokoReference = 'REF-' + randomStr;
const kokoOrderId = 'ORD-' + randomStr;
const firstName = 'Test';
const lastName = 'User';
const email = 'test@example.com';
const productName = 'SkincareProducts';
const mobile = '94777904054';

const returnUrl = 'https://beautyinbalance.onrender.com/api/payments/koko/return';
const cancelUrl = 'https://beautyinbalance.onrender.com/api/payments/koko/cancel';
const responseUrl = 'https://beautyinbalance.onrender.com/api/payments/koko/callback';

const dataString = KOKO_MERCHANT_ID + amount + currency + pluginName + pluginVersion + returnUrl + cancelUrl + kokoOrderId + kokoReference + firstName + lastName + email + productName + KOKO_API_KEY + responseUrl;

const PROD_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCw1V5rbd5fEmvVbZebzxWicu6SOLwOndJvigBo36wS6iWRmePj
TDCyLbczmKte77389Ct1y/ENnRjxBQ4693dBSm/SJflnpirb15VThgvm++5ClKUU
OKPBEWIVtxLxVZxLiz+lk/TyOlVUOm5ioIHZ3Y4jS86sG0A1W8tFrReOEwIDAQAB
AoGAR2BIdUpqqKtR1VsgB+cFj4WeoGzAE5JGf3kPg0VNOnFCasvX/UYinbjwKqZj
/bT9Vd3ksO55xQn1KEvnG4wJmSXpxLwkVqX/nHLZ8dIK7ZCsqCbeYoWCwmBTkK+h
OKrngdx8DKHCryjzDiOULCz4TKUNrklpPOp0g6tvH4EBU5kCQQD7B9n1iAhvWN/k
HStg3Xg2avd+BYhgoR/sjsBIm3+k7zIHHi0MUPa4KN7KxBMpp/HMALC2iKRIeN/g
o553yPjnAkEAtFWCFduiJAicDUQQ14MJnbT9Ojs8GhN9JH8+1SLyVR2Br23OXxko
rVfVJo7ggAzI+xtu5SMhU58Li49yBOu/9QJBAMK9V4fTbP+8SYv0WQd/J9fHaZH5
BtA3jsV8BI0PHJm9+ehtr3LDiHJbOmLAc0E4iSrCSlSAcjnKk5r4M2InpXcCQCfM
t2kbkC1juQ00eIMX6Idl6n1vlVQr+PKVIsjnbZRbbsPI+EMEynV3bROVdPbN242Q
AGmR10kdUO78Oa3cWgECQQCJmBp4xHhxQPQUgTrAvoFixSVauSuYxUh523itAfKo
bPzmEOUUWMeR2zSGgXcZvauFJZodkeYTHGl2MphDn96U
-----END RSA PRIVATE KEY-----`;

const sign = crypto.createSign('SHA256');
sign.update(dataString);
const signatureEncoded = sign.sign(PROD_PRIVATE_KEY, 'base64');

const formDataParams = new URLSearchParams();
formDataParams.append('_mId', KOKO_MERCHANT_ID);
formDataParams.append('api_key', KOKO_API_KEY);
formDataParams.append('_returnUrl', returnUrl);
formDataParams.append('_responseUrl', responseUrl);
formDataParams.append('_currency', currency);
formDataParams.append('_amount', amount);
formDataParams.append('_reference', kokoReference);
formDataParams.append('_pluginName', pluginName);
formDataParams.append('_pluginVersion', pluginVersion);
formDataParams.append('_cancelUrl', cancelUrl);
formDataParams.append('_orderId', kokoOrderId);
formDataParams.append('_firstName', firstName);
formDataParams.append('_lastName', lastName);
formDataParams.append('_email', email);
formDataParams.append('_description', productName);
formDataParams.append('dataString', dataString);
formDataParams.append('signature', signatureEncoded);
formDataParams.append('_mobileNo', mobile);
formDataParams.append('mobileNumber', mobile);

axios.post(BASE_URL + '/api/merchants/orderCreate', formDataParams, {
    maxRedirects: 0,
    validateStatus: function (status) { return status >= 200 && status < 400; }
}).then(res => {
    console.log('STATUS:', res.status);
    console.log('HEADERS:', res.headers);
    console.log('DATA:', res.data.substring(0, 500));
}).catch(err => console.error('ERR:', err.message));
