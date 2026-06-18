<?php
$order_id = 'ORD123';
$merchant = 'c8cca514bdfa0582cdc40c9703c71e9d';
$amount = '300.00';
$currency = 'LKR';
$pluginName = 'customapi';
$pluginVersion = '1.0.1';
$reference = 'REF123';
$firstName = 'John';
$lastName = 'Doe';
$email = 'john@gmail.com';
$apiKey = '83fA5n1xUaj8OKnX23YY5vlni5q39gBi';
$responseUrl = 'https://www.beimmune.lk/response';
$returnUrl = 'https://www.beimmune.lk/return';
$cancelUrl = 'https://www.beimmune.lk/cancel';
$productName = 'products';

$dataString = $merchant . $amount . $currency . $pluginName . $pluginVersion .
    $returnUrl . $cancelUrl . $order_id . $reference .
    $firstName . $lastName . $email . $productName .
    $apiKey . $responseUrl;

$privKeyString = <<<KEY
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
KEY;

$private_key = openssl_get_privatekey($privKeyString);
openssl_sign($dataString, $signature, $private_key, OPENSSL_ALGO_SHA256);
echo base64_encode($signature);
?>
