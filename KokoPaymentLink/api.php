<?php

function kokopay()
{
    // Static test values
    $order_id = 'ORD-1715760000-123';
    $merchant = 'f189fb3e92507eb60dced60bf2b3b93a';
    $amount = '1500.00';
    $currency = 'LKR';
    $pluginName = 'customapi';
    $pluginVersion = '1.0.1';
    $reference = '1715760000';
    $firstName = 'John';
    $lastName = 'Doe';
    $email = 'john@gmail.com';
    $mobile = '0771234567';
    $apiKey = 'fg419Ly0dJfcZV4XYtjewwPnwtbOoPbO';

    // Determine base URL dynamically (Force HTTPS)
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $baseUrl = 'https://' . $host;

    $responseUrl = $baseUrl . '/index.php/response';
    $returnUrl = $baseUrl . '/index.php/return';
    $cancelUrl = $baseUrl . '/index.php/cancel';
    $productName = 'products';

    // KokoPay required data string (order is critical!)
    $dataString = $merchant . $amount . $currency . $pluginName . $pluginVersion .
        $returnUrl . $cancelUrl . $order_id . $reference .
        $firstName . $lastName . $email . $productName .
        $apiKey . $responseUrl;

    // Load the private key (test key provided)
    $privKeyString = <<<KEY
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
KEY;

    $private_key = openssl_get_privatekey($privKeyString);

    if (!openssl_sign($dataString, $signature, $private_key, OPENSSL_ALGO_SHA256)) {
        $signatureEncoded = openssl_error_string();
    } else {
        $signatureEncoded = base64_encode($signature);
    }

    $koko_args = [
        '_mId' => $merchant,
        'api_key' => $apiKey,
        '_returnUrl' => $returnUrl,
        '_responseUrl' => $responseUrl,
        '_currency' => $currency,
        '_amount' => $amount,
        '_reference' => $reference,
        '_pluginName' => $pluginName,
        '_pluginVersion' => $pluginVersion,
        '_cancelUrl' => $cancelUrl,
        '_orderId' => $order_id,
        '_firstName' => $firstName,
        '_lastName' => $lastName,
        '_email' => $email,
        '_description' => $productName,
        'dataString' => $dataString,
        'signature' => $signatureEncoded,
        '_mobileNo' => $mobile
    ];

    $hidden_inputs = '';
    foreach ($koko_args as $key => $value) {
        $hidden_inputs .= "<input type='hidden' name='$key' value='" . htmlspecialchars($value, ENT_QUOTES) . "'/>\n";
    }

    $url = 'https://prodapi.paykoko.com/api/merchants/orderCreate';

    echo <<<HTML
<!DOCTYPE html>
<html>
<head>
    <title>KokoPay Test</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://malsup.github.io/jquery.blockUI.js"></script>
</head>
<body>
<form action="$url" method="post" id="darazbnpl_payment_form">
    $hidden_inputs
    <input type="submit" class="button-alt" id="submit_darazbnpl_payment_form" value="Proceed to Payment" />
    <a class="button cancel" href="$cancelUrl">Cancel</a>
</form>
<script type="text/javascript">
    jQuery(function(){
        jQuery("body").block({
            message: 'Thanks for your order! Redirecting to Koko Payment Gateway...',
            overlayCSS: {
                background: "#fff",
                opacity: 0.8
            },
            css: {
                padding: 20,
                textAlign: "center",
                color: "#333",
                border: "1px solid #eee",
                backgroundColor: "#fff",
                cursor: "wait",
                lineHeight: "32px"
            }
        });
        jQuery("#submit_darazbnpl_payment_form").click();
    });
</script>
</body>
</html>
HTML;
}

// Call the function
kokopay();