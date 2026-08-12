<?php
// ==============================================================================
// Koko Pay - Payment Link Integration
// Automatically generated payment gateway form with Webhook & Order Tracking
// ==============================================================================

// --- Configuration (From Koko QA Details) ---
$merchantId = 'f189fb3e92507eb60dced60bf2b3b93a';
$apiKey = 'fg419Ly0dJfcZV4XYtjewwPnwtbOoPbO';
$endpointUrl = 'https://prodapi.paykoko.com/api/merchants/orderCreate';

$publicKeyString = <<<EOD
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDwDt4Q9B+MEAcxP8pPeTYGh22
lvCOxxKEwDuJPAvTtYpfiqU1Ip//njnMgWIpFcpIcqabALPrkHW8eD37SBzQ6R5l
fr01xf7lBG3bGqNXZkdXb0txnoXSmPya+B4oGqZc+KWNrKTntY3sNKD6k4tdOeoX
83rxb/gnZR5v7WP7WQIDAQAB
-----END PUBLIC KEY-----
EOD;

$privateKeyString = <<<EOD
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
EOD;

$uri = $_SERVER['REQUEST_URI'];

// --- Webhook / Server-to-Server Response ---
// Koko will send a POST request here when payment is successful
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($uri, '/response') !== false) {
    $orderId = $_POST['orderId'] ?? '';
    $trnId = $_POST['trnId'] ?? '';
    $paymentStatus = $_POST['status'] ?? ''; 
    $signatureEncoded = $_POST['signature'] ?? '';
    
    // Verify Signature according to Documentation V1.05
    $dataString = $orderId . $trnId . $paymentStatus;
    $signature = base64_decode($signatureEncoded);
    $publicKey = openssl_get_publickey($publicKeyString);
    
    $verify = openssl_verify($dataString, $signature, $publicKey, OPENSSL_ALGO_SHA256);
    
    if ($verify === 1) {
        $ordersFile = __DIR__ . '/orders.json';
        if (file_exists($ordersFile)) {
            $orders = json_decode(file_get_contents($ordersFile), true);
            if (isset($orders[$orderId])) {
                $orders[$orderId]['status'] = $paymentStatus;
                $orders[$orderId]['koko_trn_id'] = $trnId;
                file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT));
            }
        }
        echo "OK";
    } else {
        http_response_code(400);
        echo "Invalid Signature";
    }
    exit;
}

// --- Process Payment Request (Form Submission) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'pay') {
    
    $firstName = trim($_POST['first_name']);
    $lastName = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $mobileRaw = preg_replace('/[^0-9]/', '', trim($_POST['mobile']));
    // Convert to international format: 077XXXXXXX -> 947XXXXXXX
    if (strlen($mobileRaw) === 10 && $mobileRaw[0] === '0') {
        $mobile = '94' . substr($mobileRaw, 1);
    } elseif (strlen($mobileRaw) === 9) {
        $mobile = '94' . $mobileRaw;
    } else {
        $mobile = $mobileRaw; // already formatted (e.g. 947...)
    }
    $amount = number_format((float)$_POST['amount'], 2, '.', '');
    $productName = trim($_POST['product_name']);
    
    $order_id = 'ORD-' . time() . '-' . rand(100, 999);
    $reference = 'REF-' . time();
    $currency = 'LKR';
    $pluginName = 'customapi';
    $pluginVersion = '1.0.1';
    
    // Determine base URL (Force HTTPS for Render)
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $baseUrl = 'https://' . $host;
    
    // Setup Endpoints (Clean URLs without query strings to prevent Koko frontend bugs)
    $returnUrl = $baseUrl . '/index.php/return';
    $cancelUrl = $baseUrl . '/index.php/cancel';
    $responseUrl = $baseUrl . '/index.php/response';

    // 1. Prepare Data String
    $dataString = $merchantId . $amount . $currency . $pluginName . $pluginVersion .
        $returnUrl . $cancelUrl . $order_id . $reference .
        $firstName . $lastName . $email . $productName .
        $apiKey . $responseUrl;

    // 2. Generate RSA SHA256 Signature
    $private_key = openssl_get_privatekey($privateKeyString);
    if (!openssl_sign($dataString, $signature, $private_key, OPENSSL_ALGO_SHA256)) {
        die("Error generating signature: " . openssl_error_string());
    }
    $signatureEncoded = base64_encode($signature);

    // 3. Save order to local JSON database as PENDING
    $orderDetails = [
        'order_id' => $order_id,
        'date' => date('Y-m-d H:i:s'),
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'mobile' => $mobile,
        'product' => $productName,
        'amount' => $amount,
        'status' => 'PENDING',
        'koko_trn_id' => ''
    ];
    $ordersFile = __DIR__ . '/orders.json';
    $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
    $orders[$order_id] = $orderDetails;
    file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT));

    // 4. Prepare parameters for Koko
    $koko_args = [
        '_mId' => $merchantId,
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
        '_mobileNo' => $mobile,
        'mobileNumber' => $mobile
    ];

    // 5. Use server-side cURL to call orderCreate, get redirect URL, inject mobileNumber
    $ch = curl_init($endpointUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($koko_args));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // Don't follow - we need the Location header
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $headers = substr($response, 0, $header_size);
    $body = substr($response, $header_size);

    // Extract the Location redirect URL from headers
    $checkout_url = '';
    if (preg_match('/Location:\s*(.*?)[\r\n]/i', $headers, $matches)) {
        $checkout_url = trim($matches[1]);
    }

    if ($checkout_url && ($http_code >= 300 && $http_code < 400)) {
        // Inject mobileNumber into the checkout redirect URL
        $separator = (strpos($checkout_url, '?') !== false) ? '&' : '?';
        $final_url = $checkout_url . $separator . 'mobileNumber=' . urlencode($mobile);

        // Show loading page then redirect to checkout with mobileNumber
        echo "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>";
        echo "<title>Redirecting to Koko Payment</title><link href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap' rel='stylesheet'><style>";
        echo "body{background:#050505;color:#fff;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}";
        echo ".spinner{width:50px;height:50px;border:3px solid rgba(255,0,94,0.2);border-top:3px solid #FF005E;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;}";
        echo "@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}";
        echo "h2{margin:0 0 10px;font-weight:600;} p{color:#888;} .koko-logo{font-weight:800;font-size:24px;color:#FF005E;letter-spacing:-1px;}";
        echo "</style></head><body><div style='text-align:center;'>";
        echo "<div class='spinner'></div><h2>Connecting Securely</h2><p>Transferring to <span class='koko-logo'>koko.</span></p></div>";
        echo "<script>setTimeout(() => { window.location.href = '" . addslashes($final_url) . "'; }, 1200);</script></body></html>";
    } else {
        // API call failed - show error with the raw response for debugging
        echo "<!DOCTYPE html><html><head><title>Error</title></head><body>";
        echo "<h2>Koko API Error (HTTP $http_code)</h2><pre>" . htmlspecialchars($body) . "</pre>";
        echo "<a href='index.php'>Go Back</a></body></html>";
    }
    exit;

}

$isReturn = strpos($uri, '/return') !== false;
$isCancel = strpos($uri, '/cancel') !== false;
$kokoStatus = isset($_GET['status']) ? $_GET['status'] : null;
$orderId = isset($_GET['orderId']) ? htmlspecialchars($_GET['orderId']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Payment Link | Koko BNPL</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --koko-pink: #FF005E;
            --koko-pink-hover: #e60054;
            --bg-color: #050505;
            --surface-color: rgba(255, 255, 255, 0.03);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-main: #ffffff;
            --text-muted: #8a8a93;
            --input-bg: rgba(255, 255, 255, 0.05);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background-color: var(--bg-color); color: var(--text-main); min-height: 100vh; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(circle at 15% 50%, rgba(255, 0, 94, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(138, 43, 226, 0.08), transparent 25%); overflow-x: hidden; padding: 20px; }
        .container { width: 100%; max-width: 500px; z-index: 10; }
        .card { background: var(--surface-color); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1); animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .header { text-align: center; margin-bottom: 35px; }
        .koko-brand { font-size: 32px; font-weight: 800; color: var(--koko-pink); letter-spacing: -1.5px; margin-bottom: 10px; display: inline-block; }
        .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.5px; }
        .header p { color: var(--text-muted); font-size: 15px; font-weight: 300; line-height: 1.5; }
        .form-group { margin-bottom: 20px; }
        .form-row { display: flex; gap: 15px; } .form-row .form-group { flex: 1; }
        label { display: block; font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        input { width: 100%; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px 16px; color: var(--text-main); font-family: 'Outfit', sans-serif; font-size: 15px; transition: all 0.3s ease; outline: none; }
        input::placeholder { color: rgba(255, 255, 255, 0.2); }
        input:focus { background: rgba(255, 255, 255, 0.08); border-color: var(--koko-pink); box-shadow: 0 0 0 4px rgba(255, 0, 94, 0.1); }
        .amount-wrapper { position: relative; }
        .amount-wrapper::before { content: "LKR"; position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 500; font-size: 15px; }
        .amount-wrapper input { padding-left: 55px; font-weight: 600; font-size: 18px; color: var(--koko-pink); }
        .btn-submit { width: 100%; background: var(--koko-pink); color: #fff; border: none; border-radius: 12px; padding: 16px; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 10px; box-shadow: 0 8px 20px rgba(255, 0, 94, 0.4); }
        .btn-submit:hover { background: var(--koko-pink-hover); transform: translateY(-2px); box-shadow: 0 12px 25px rgba(255, 0, 94, 0.5); }
        .status-card { text-align: center; padding: 20px 0; }
        .status-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px; }
        .status-success .status-icon { background: rgba(46, 213, 115, 0.1); color: #2ed573; border: 2px solid rgba(46, 213, 115, 0.3); }
        .status-cancel .status-icon { background: rgba(255, 71, 87, 0.1); color: #ff4757; border: 2px solid rgba(255, 71, 87, 0.3); }
        .status-title { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
        .status-desc { color: var(--text-muted); margin-bottom: 30px; line-height: 1.6; }
        .btn-outline { display: inline-block; padding: 12px 30px; border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-main); text-decoration: none; font-weight: 500; transition: all 0.3s; }
        .btn-outline:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.2); }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            
            <?php if ($isReturn && $kokoStatus === 'SUCCESS'): ?>
                <div class="status-card status-success">
                    <div class="status-icon">✓</div>
                    <h2 class="status-title">Payment Successful</h2>
                    <p class="status-desc">Thank you! Your payment for order <?php echo $orderId; ?> has been processed successfully.</p>
                    <a href="index.php" class="btn-outline">Make Another Payment</a>
                </div>
                
            <?php elseif ($isReturn && $kokoStatus === 'FAILURE'): ?>
                <div class="status-card status-cancel">
                    <div class="status-icon">✕</div>
                    <h2 class="status-title">Payment Failed</h2>
                    <p class="status-desc">Unfortunately, your payment could not be completed. Please try again.</p>
                    <a href="index.php" class="btn-outline">Try Again</a>
                </div>
 
            <?php elseif ($isCancel): ?>
                <div class="status-card status-cancel">
                    <div class="status-icon">✕</div>
                    <h2 class="status-title">Payment Cancelled</h2>
                    <p class="status-desc">Your payment was cancelled. No charges were made to your account.</p>
                    <a href="index.php" class="btn-outline">Try Again</a>
                </div>
 
            <?php else: ?>
                <div class="header">
                    <div class="koko-brand">koko.</div>
                    <h1>Complete Your Order</h1>
                    <p>Pay in 3 interest-free instalments.<br>Enter your details below to proceed.</p>
                </div>
 
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="pay">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="first_name">First Name</label>
                            <input type="text" id="first_name" name="first_name" placeholder="John" value="<?php echo isset($_GET['first_name']) ? htmlspecialchars($_GET['first_name']) : ''; ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last Name</label>
                            <input type="text" id="last_name" name="last_name" placeholder="Doe" value="<?php echo isset($_GET['last_name']) ? htmlspecialchars($_GET['last_name']) : ''; ?>" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="john@example.com" value="<?php echo isset($_GET['email']) ? htmlspecialchars($_GET['email']) : ''; ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="mobile">Mobile Number</label>
                        <input type="tel" id="mobile" name="mobile" placeholder="077XXXXXXX" value="<?php echo isset($_GET['mobile']) ? htmlspecialchars($_GET['mobile']) : ''; ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="product_name">Order Description</label>
                        <input type="text" id="product_name" name="product_name" placeholder="e.g. Website Design" value="<?php echo isset($_GET['product_name']) ? htmlspecialchars($_GET['product_name']) : ''; ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="amount">Amount Payable</label>
                        <div class="amount-wrapper">
                            <input type="number" id="amount" name="amount" placeholder="0.00" step="0.01" min="10" value="<?php echo isset($_GET['amount']) ? htmlspecialchars($_GET['amount']) : ''; ?>" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-submit">Proceed to Pay</button>
                </form>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
