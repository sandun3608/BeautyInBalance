const crypto = require('crypto');

const QA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCnAPcpmvA3Iipb7Fn+eAmO/P4Xv8y+PVm8FrDhqOSeMqaUQmzf
iZ6xw+ejCmye46MMW5SaA03Hnm0WGDXqYhMR0TiWUgXRCeQImxSq+wXwd+0ufxW+
ANnvH9l/mxcPwlGr2BKJTUJy2NQt8FZ9R6NSfIlKzdyGStvzF3j0KdBnjQIDAQAB
AoGAVMjwsnaurc7yomiD5+UZNTbL6VK+p3aOMCd09ZvBNW+RkoOGspYzsxw6ZVPN
gX0gMg3si6RRwJ5101nHRY81DmysZ90kgJsknqxUuwKGU6k2Wk18JqJBLGLXilwR
Z5/NjdgohoZDrJbbr029LNLZ06pvpdXtvVRM9A1XZVzEnAECQQDQ02Wg7nGFvS4M
yRWMHNARLto19W/Q+BlCsWRCDYO5zns9BtaqzZ3CyOAaXObDs6ZWpCEY+3e84u3X
pvBpdOGtAkEAzLr15YBG9Y3hQgErwIUd0dSlYiDzaIM9DszIh+lzCIi/bUM6nXQi
IZ0zDJmLjwa0bMduO+ZDiUbxuCFlxhEZYQJAdpTEbhlYr4gYwTvil3i5EjjXwrJH
t5NazMts0jFYbsd4pdPfTIiMIFLvJylABTtbpnF3Nfd+K+10//OVK10q1QJBAMLU
qW3exaipfNTziE+OXvJxC3J3KS0st85909iDsZVNjd7NO9rbyh9zGkHDXayfFNTw
dVdLqrnZae9w2QnE/AECQF+cRPcQMA1wbmOBCyn/C1YAMji71DtplJF9fFOxlp9P
XdzBrBj9flrwjasEs3WKrepvZ9A0GT5HaG15ULd2/rc=
-----END RSA PRIVATE KEY-----`;

const merchant = 'c8cca514bdfa0582cdc40c9703c71e9d';
const amount = '5000';
const currency = 'LKR';
const pluginName = 'customapi';
const pluginVersion = '1';
const redirect_url = 'https://koko-test.onrender.com/';
const order_id = '12345';
const reference = 'REF12345';
const firstName = 'Joe';
const lastName = 'Kate';
const email = 'webivox@gmail.com';
const productName = '1 Product';
const apiKey = '83fA5n1xUaj8OKnX23YY5vlni5q39gBi';
const mobile = '0777904054';

const dataString = merchant + amount + currency + pluginName + pluginVersion + redirect_url + redirect_url + order_id + reference + firstName + lastName + email + productName + apiKey + redirect_url;

const sign = crypto.createSign('SHA256');
sign.update(dataString);
const signature = sign.sign(QA_PRIVATE_KEY, 'base64');

async function test() {
    const fetch = (await import('node-fetch')).default || fetch || globalThis.fetch;
    const params = new URLSearchParams();
    params.append('_mId', merchant);
    params.append('api_key', apiKey);
    params.append('_returnUrl', redirect_url);
    params.append('_responseUrl', redirect_url);
    params.append('_currency', currency);
    params.append('_amount', amount);
    params.append('_reference', reference);
    params.append('_pluginName', pluginName);
    params.append('_pluginVersion', pluginVersion);
    params.append('_cancelUrl', redirect_url);
    params.append('_orderId', order_id);
    params.append('_firstName', firstName);
    params.append('_lastName', lastName);
    params.append('_email', email);
    params.append('_description', productName);
    params.append('dataString', dataString);
    params.append('signature', signature);
    params.append('_mobileNo', mobile);

    try {
        const res = await fetch('https://qaapi.paykoko.com/api/merchants/orderCreate', {
            method: 'POST',
            body: params
        });
        console.log(await res.text());
    } catch (e) {
        console.error(e);
    }
}
test();
