<?php
session_start();

// ==============================================================================
// Koko Pay - Merchant Dashboard
// Login + Order Tracking + Analytics
// ==============================================================================

// --- Merchant Credentials ---
$MERCHANT_USERNAME = 'admin';
$MERCHANT_PASSWORD = 'koko@2024';

// --- Handle Logout ---
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: dashboard.php');
    exit;
}

// --- Handle Login ---
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_action'])) {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    if ($username === $MERCHANT_USERNAME && $password === $MERCHANT_PASSWORD) {
        $_SESSION['merchant_logged_in'] = true;
        $_SESSION['merchant_user'] = $username;
        $_SESSION['login_time'] = date('Y-m-d H:i:s');
        header('Location: dashboard.php');
        exit;
    } else {
        $loginError = 'Invalid username or password';
    }
}

$isLoggedIn = isset($_SESSION['merchant_logged_in']) && $_SESSION['merchant_logged_in'] === true;

// --- Load Orders ---
$orders = [];
$ordersFile = __DIR__ . '/orders.json';
if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true) ?? [];
}

// Sort orders by date (newest first)
uasort($orders, function($a, $b) {
    return strtotime($b['date'] ?? '0') - strtotime($a['date'] ?? '0');
});

// --- Filter/Search ---
$searchQuery = trim($_GET['search'] ?? '');
$statusFilter = trim($_GET['status'] ?? '');

if ($searchQuery || $statusFilter) {
    $orders = array_filter($orders, function($order) use ($searchQuery, $statusFilter) {
        $matchSearch = true;
        $matchStatus = true;
        
        if ($searchQuery) {
            $haystack = strtolower(
                ($order['order_id'] ?? '') . ' ' .
                ($order['first_name'] ?? '') . ' ' .
                ($order['last_name'] ?? '') . ' ' .
                ($order['email'] ?? '') . ' ' .
                ($order['mobile'] ?? '') . ' ' .
                ($order['product'] ?? '') . ' ' .
                ($order['koko_trn_id'] ?? '')
            );
            $matchSearch = strpos($haystack, strtolower($searchQuery)) !== false;
        }
        
        if ($statusFilter) {
            $matchStatus = strtoupper($order['status'] ?? '') === strtoupper($statusFilter);
        }
        
        return $matchSearch && $matchStatus;
    });
}

// --- Calculate Stats ---
$allOrders = file_exists($ordersFile) ? (json_decode(file_get_contents($ordersFile), true) ?? []) : [];
$totalOrders = count($allOrders);
$totalRevenue = 0;
$successCount = 0;
$pendingCount = 0;
$failedCount = 0;

foreach ($allOrders as $o) {
    $status = strtoupper($o['status'] ?? '');
    $amt = floatval($o['amount'] ?? 0);
    
    if ($status === 'SUCCESS' || $status === 'COMPLETED') {
        $successCount++;
        $totalRevenue += $amt;
    } elseif ($status === 'PENDING') {
        $pendingCount++;
    } else {
        $failedCount++;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merchant Dashboard | Koko Pay</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --koko-pink: #FF005E;
            --koko-pink-hover: #e60054;
            --koko-pink-glow: rgba(255, 0, 94, 0.15);
            --bg-color: #050505;
            --bg-elevated: #0a0a0a;
            --surface-color: rgba(255, 255, 255, 0.03);
            --surface-hover: rgba(255, 255, 255, 0.06);
            --border-color: rgba(255, 255, 255, 0.08);
            --border-hover: rgba(255, 255, 255, 0.15);
            --text-main: #ffffff;
            --text-secondary: #c0c0c8;
            --text-muted: #6b6b78;
            --input-bg: rgba(255, 255, 255, 0.05);
            --success: #2ed573;
            --success-bg: rgba(46, 213, 115, 0.1);
            --warning: #ffa502;
            --warning-bg: rgba(255, 165, 2, 0.1);
            --danger: #ff4757;
            --danger-bg: rgba(255, 71, 87, 0.1);
            --info: #3b82f6;
            --info-bg: rgba(59, 130, 246, 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* ========== LOGIN PAGE ========== */
        .login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image:
                radial-gradient(circle at 15% 50%, rgba(255, 0, 94, 0.08), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(138, 43, 226, 0.08), transparent 25%);
            padding: 20px;
        }

        .login-card {
            width: 100%;
            max-width: 440px;
            background: var(--surface-color);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 48px 40px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(30px);
        }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 94, 0.2); } 50% { box-shadow: 0 0 40px rgba(255, 0, 94, 0.4); } }

        .login-header { text-align: center; margin-bottom: 36px; }
        .koko-brand { font-size: 36px; font-weight: 800; color: var(--koko-pink); letter-spacing: -1.5px; display: inline-block; }
        .koko-brand-sub { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 3px; margin-top: 4px; }
        .login-header h1 { font-size: 22px; font-weight: 600; margin-top: 20px; letter-spacing: -0.3px; }
        .login-header p { color: var(--text-muted); font-size: 14px; font-weight: 300; margin-top: 6px; }

        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 12px; font-weight: 500; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; }
        
        input[type="text"], input[type="password"], input[type="email"], input[type="search"] {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 14px 16px;
            color: var(--text-main);
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
        }
        input::placeholder { color: rgba(255, 255, 255, 0.2); }
        input:focus { background: rgba(255, 255, 255, 0.08); border-color: var(--koko-pink); box-shadow: 0 0 0 4px rgba(255, 0, 94, 0.1); }

        .btn-primary {
            width: 100%;
            background: var(--koko-pink);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 15px;
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
            box-shadow: 0 8px 20px rgba(255, 0, 94, 0.35);
        }
        .btn-primary:hover { background: var(--koko-pink-hover); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(255, 0, 94, 0.5); }

        .login-error {
            background: var(--danger-bg);
            border: 1px solid rgba(255, 71, 87, 0.3);
            color: var(--danger);
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }

        .login-footer { text-align: center; margin-top: 24px; color: var(--text-muted); font-size: 13px; }
        .lock-icon { display: inline-block; margin-right: 6px; }

        /* ========== DASHBOARD ========== */
        .dashboard { min-height: 100vh; background: var(--bg-color); }

        /* Top Nav */
        .topnav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 32px;
            border-bottom: 1px solid var(--border-color);
            background: rgba(5, 5, 5, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .topnav-left { display: flex; align-items: center; gap: 20px; }
        .topnav .koko-brand { font-size: 26px; }
        .nav-divider { width: 1px; height: 28px; background: var(--border-color); }
        .nav-title { font-size: 15px; font-weight: 500; color: var(--text-secondary); }
        .topnav-right { display: flex; align-items: center; gap: 16px; }
        .merchant-info { text-align: right; }
        .merchant-name { font-size: 14px; font-weight: 500; }
        .merchant-time { font-size: 12px; color: var(--text-muted); }
        
        .btn-logout {
            padding: 8px 18px;
            background: transparent;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .btn-logout:hover { background: var(--danger-bg); border-color: rgba(255, 71, 87, 0.3); color: var(--danger); }

        /* Content */
        .content { max-width: 1280px; margin: 0 auto; padding: 32px; }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }

        .stat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

        .stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin-bottom: 16px;
        }
        .stat-icon.pink { background: var(--koko-pink-glow); color: var(--koko-pink); }
        .stat-icon.green { background: var(--success-bg); color: var(--success); }
        .stat-icon.yellow { background: var(--warning-bg); color: var(--warning); }
        .stat-icon.red { background: var(--danger-bg); color: var(--danger); }

        .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 400; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 32px; font-weight: 700; margin-top: 4px; letter-spacing: -1px; }
        .stat-value.pink { color: var(--koko-pink); }
        .stat-value.green { color: var(--success); }

        /* Orders Section */
        .orders-section {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            overflow: hidden;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        .orders-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 28px;
            border-bottom: 1px solid var(--border-color);
            flex-wrap: wrap;
            gap: 16px;
        }
        .orders-header h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.3px; }
        .orders-count { font-size: 13px; color: var(--text-muted); margin-left: 10px; font-weight: 400; }

        .orders-filters { display: flex; gap: 10px; flex-wrap: wrap; }

        .search-box {
            position: relative;
        }
        .search-box input {
            width: 260px;
            padding: 10px 14px 10px 38px;
            font-size: 13px;
            border-radius: 10px;
        }
        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 14px;
            pointer-events: none;
        }

        .filter-btn {
            padding: 10px 16px;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-secondary);
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        .filter-btn:hover { background: var(--surface-hover); border-color: var(--border-hover); }
        .filter-btn.active { background: var(--koko-pink-glow); border-color: rgba(255, 0, 94, 0.3); color: var(--koko-pink); }

        /* Table */
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table thead th {
            text-align: left;
            padding: 14px 20px;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.01);
        }
        .orders-table tbody tr {
            transition: all 0.2s ease;
            cursor: default;
        }
        .orders-table tbody tr:hover { background: var(--surface-hover); }
        .orders-table tbody td {
            padding: 16px 20px;
            font-size: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: middle;
        }

        .order-id { font-weight: 600; color: var(--koko-pink); font-size: 13px; font-family: 'Courier New', monospace; }
        .customer-name { font-weight: 500; }
        .customer-email { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .order-amount { font-weight: 600; font-size: 15px; }
        .order-date { color: var(--text-muted); font-size: 13px; }

        /* Status Badge */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-badge .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }
        .status-badge.success { background: var(--success-bg); color: var(--success); border: 1px solid rgba(46, 213, 115, 0.2); }
        .status-badge.success .dot { background: var(--success); animation: pulseGlow 2s ease infinite; box-shadow: 0 0 6px var(--success); }
        .status-badge.pending { background: var(--warning-bg); color: var(--warning); border: 1px solid rgba(255, 165, 2, 0.2); }
        .status-badge.pending .dot { background: var(--warning); animation: pulseGlow 2s ease infinite; box-shadow: 0 0 6px var(--warning); }
        .status-badge.failed { background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(255, 71, 87, 0.2); }
        .status-badge.failed .dot { background: var(--danger); }

        .koko-trn { font-size: 12px; color: var(--text-muted); font-family: 'Courier New', monospace; }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 80px 40px;
            animation: fadeIn 0.5s ease;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
        .empty-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .empty-desc { color: var(--text-muted); font-size: 14px; }

        /* Order Detail Modal */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 200;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-overlay.active { display: flex; }

        .modal {
            background: var(--bg-elevated);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            width: 100%;
            max-width: 520px;
            padding: 32px;
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .modal-header h3 { font-size: 18px; font-weight: 600; }
        .modal-close {
            width: 36px; height: 36px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            background: transparent;
            color: var(--text-muted);
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .modal-close:hover { background: var(--danger-bg); border-color: rgba(255, 71, 87, 0.3); color: var(--danger); }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-size: 13px; color: var(--text-muted); font-weight: 400; }
        .detail-value { font-size: 14px; font-weight: 500; text-align: right; max-width: 60%; word-break: break-all; }

        /* Responsive */
        @media (max-width: 900px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .content { padding: 20px; }
            .topnav { padding: 14px 20px; }
            .merchant-info { display: none; }
        }

        @media (max-width: 640px) {
            .stats-grid { grid-template-columns: 1fr; }
            .orders-header { flex-direction: column; align-items: stretch; }
            .search-box input { width: 100%; }
            .orders-filters { flex-direction: column; }
            .orders-table thead { display: none; }
            .orders-table tbody tr {
                display: block;
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color);
            }
            .orders-table tbody td {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border: none;
            }
            .orders-table tbody td::before {
                content: attr(data-label);
                font-size: 12px;
                color: var(--text-muted);
                text-transform: uppercase;
                font-weight: 500;
            }
            .login-card { padding: 32px 24px; }
            .topnav-left .nav-title { display: none; }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
    </style>
</head>
<body>

<?php if (!$isLoggedIn): ?>
<!-- ==================== LOGIN PAGE ==================== -->
<div class="login-wrapper">
    <div class="login-card">
        <div class="login-header">
            <div class="koko-brand">koko.</div>
            <div class="koko-brand-sub">Merchant Portal</div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your dashboard</p>
        </div>

        <?php if ($loginError): ?>
            <div class="login-error">⚠ <?php echo htmlspecialchars($loginError); ?></div>
        <?php endif; ?>

        <form method="POST" action="dashboard.php">
            <input type="hidden" name="login_action" value="1">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter username" required autocomplete="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter password" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn-primary">Sign In</button>
        </form>

        <div class="login-footer">
            <span class="lock-icon">🔒</span> Secured merchant access
        </div>
    </div>
</div>

<?php else: ?>
<!-- ==================== DASHBOARD ==================== -->
<div class="dashboard">
    <!-- Top Navigation -->
    <nav class="topnav">
        <div class="topnav-left">
            <div class="koko-brand">koko.</div>
            <div class="nav-divider"></div>
            <span class="nav-title">Merchant Dashboard</span>
        </div>
        <div class="topnav-right">
            <div class="merchant-info">
                <div class="merchant-name">👋 <?php echo htmlspecialchars($_SESSION['merchant_user']); ?></div>
                <div class="merchant-time">Since <?php echo htmlspecialchars($_SESSION['login_time']); ?></div>
            </div>
            <a href="dashboard.php?action=logout" class="btn-logout">Sign Out</a>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="content">
        
        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon pink">📦</div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-value"><?php echo $totalOrders; ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">💰</div>
                <div class="stat-label">Revenue (Success)</div>
                <div class="stat-value green">Rs. <?php echo number_format($totalRevenue, 2); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon yellow">⏳</div>
                <div class="stat-label">Pending</div>
                <div class="stat-value"><?php echo $pendingCount; ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">❌</div>
                <div class="stat-label">Failed / Cancelled</div>
                <div class="stat-value"><?php echo $failedCount; ?></div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="orders-section">
            <div class="orders-header">
                <div>
                    <h2>Orders <span class="orders-count">(<?php echo count($orders); ?> results)</span></h2>
                </div>
                <div class="orders-filters">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <form method="GET" action="dashboard.php" style="display:inline;" id="searchForm">
                            <input type="hidden" name="status" value="<?php echo htmlspecialchars($statusFilter); ?>">
                            <input type="search" name="search" placeholder="Search orders..." value="<?php echo htmlspecialchars($searchQuery); ?>" onchange="document.getElementById('searchForm').submit();">
                        </form>
                    </div>
                    <a href="dashboard.php<?php echo $searchQuery ? '?search=' . urlencode($searchQuery) : ''; ?>" class="filter-btn <?php echo !$statusFilter ? 'active' : ''; ?>">All</a>
                    <a href="dashboard.php?status=SUCCESS<?php echo $searchQuery ? '&search=' . urlencode($searchQuery) : ''; ?>" class="filter-btn <?php echo $statusFilter === 'SUCCESS' ? 'active' : ''; ?>">✓ Success</a>
                    <a href="dashboard.php?status=PENDING<?php echo $searchQuery ? '&search=' . urlencode($searchQuery) : ''; ?>" class="filter-btn <?php echo $statusFilter === 'PENDING' ? 'active' : ''; ?>">⏳ Pending</a>
                    <a href="dashboard.php?status=FAILURE<?php echo $searchQuery ? '&search=' . urlencode($searchQuery) : ''; ?>" class="filter-btn <?php echo $statusFilter === 'FAILURE' ? 'active' : ''; ?>">✕ Failed</a>
                </div>
            </div>

            <?php if (empty($orders)): ?>
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <div class="empty-title">No orders found</div>
                    <div class="empty-desc">
                        <?php if ($searchQuery || $statusFilter): ?>
                            Try adjusting your search or filter criteria.
                        <?php else: ?>
                            Orders will appear here once customers complete payments.
                        <?php endif; ?>
                    </div>
                </div>
            <?php else: ?>
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Koko Txn</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $order): 
                            $status = strtoupper($order['status'] ?? 'UNKNOWN');
                            $statusClass = 'pending';
                            if ($status === 'SUCCESS' || $status === 'COMPLETED') $statusClass = 'success';
                            elseif ($status === 'FAILURE' || $status === 'FAILED' || $status === 'CANCELLED') $statusClass = 'failed';
                        ?>
                        <tr onclick="showOrderDetail(<?php echo htmlspecialchars(json_encode($order), ENT_QUOTES); ?>)">
                            <td data-label="Order ID">
                                <span class="order-id"><?php echo htmlspecialchars($order['order_id'] ?? '—'); ?></span>
                            </td>
                            <td data-label="Customer">
                                <div class="customer-name"><?php echo htmlspecialchars(($order['first_name'] ?? '') . ' ' . ($order['last_name'] ?? '')); ?></div>
                                <div class="customer-email"><?php echo htmlspecialchars($order['email'] ?? ''); ?></div>
                            </td>
                            <td data-label="Product"><?php echo htmlspecialchars($order['product'] ?? '—'); ?></td>
                            <td data-label="Amount">
                                <span class="order-amount">Rs. <?php echo number_format(floatval($order['amount'] ?? 0), 2); ?></span>
                            </td>
                            <td data-label="Status">
                                <span class="status-badge <?php echo $statusClass; ?>">
                                    <span class="dot"></span>
                                    <?php echo $status; ?>
                                </span>
                            </td>
                            <td data-label="Koko Txn">
                                <span class="koko-trn"><?php echo htmlspecialchars($order['koko_trn_id'] ?? '—'); ?></span>
                            </td>
                            <td data-label="Date">
                                <span class="order-date"><?php echo htmlspecialchars($order['date'] ?? '—'); ?></span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Order Detail Modal -->
<div class="modal-overlay" id="orderModal">
    <div class="modal">
        <div class="modal-header">
            <h3>Order Details</h3>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div id="modalContent"></div>
    </div>
</div>

<script>
function showOrderDetail(order) {
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('modalContent');
    
    const statusClass = (() => {
        const s = (order.status || '').toUpperCase();
        if (s === 'SUCCESS' || s === 'COMPLETED') return 'success';
        if (s === 'FAILURE' || s === 'FAILED' || s === 'CANCELLED') return 'failed';
        return 'pending';
    })();

    content.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Order ID</span>
            <span class="detail-value order-id">${order.order_id || '—'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Customer</span>
            <span class="detail-value">${(order.first_name || '') + ' ' + (order.last_name || '')}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">${order.email || '—'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Mobile</span>
            <span class="detail-value">${order.mobile || '—'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Product</span>
            <span class="detail-value">${order.product || '—'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount</span>
            <span class="detail-value" style="font-size:18px;font-weight:700;color:var(--koko-pink);">Rs. ${parseFloat(order.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value"><span class="status-badge ${statusClass}"><span class="dot"></span>${(order.status || 'UNKNOWN').toUpperCase()}</span></span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Koko Transaction ID</span>
            <span class="detail-value koko-trn">${order.koko_trn_id || '—'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">${order.date || '—'}</span>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});
</script>

<?php endif; ?>

</body>
</html>
