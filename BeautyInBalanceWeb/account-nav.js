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

    // Inject Login/Account into Mobile Drawer
    const mobileNavs = document.querySelectorAll('.mobile-nav');
    mobileNavs.forEach(nav => {
        // Prevent duplicate injection
        if (nav.querySelector('.injected-auth-link')) return;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'injected-auth-link';
        a.style.cssText = 'font-size: 1.2rem; font-weight: 700; color: var(--gold); display:flex; align-items:center; gap:10px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(0,0,0,0.05);';
        
        if (userInfo) {
            a.href = userInfo.isAdmin ? 'admin.html' : 'account.html';
            a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> My Account`;
        } else {
            a.href = 'login.html';
            a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Login / Sign Up`;
        }
        
        li.appendChild(a);
        nav.appendChild(li);
    });
});

// --- GLOBAL MOBILE DRAWER ACCORDION TOGGLE ---
function toggleMobileAccordion(btn) {
    btn.classList.toggle('active');
    const content = btn.nextElementSibling;
    if (content) {
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }
}

