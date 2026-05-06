document.addEventListener('DOMContentLoaded', () => {
    const userIcons = document.querySelectorAll('a[href="login.html"], a[href="dashboard.html"]');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    userIcons.forEach(icon => {
        if (userInfo) {
            // If it's a mobile icon or a desktop icon, point to account or admin
            if (userInfo.isAdmin) {
                icon.setAttribute('href', 'admin.html');
            } else {
                icon.setAttribute('href', 'account.html');
            }
            
            // Optionally change the icon tooltip or label
            if (icon.getAttribute('aria-label') === 'Account') {
                icon.setAttribute('title', `Logged in as ${userInfo.name}`);
            }
        } else {
            icon.setAttribute('href', 'login.html');
        }
    });
});
