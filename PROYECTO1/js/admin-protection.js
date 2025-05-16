// Immediate execution to prevent any content from loading before authentication check
(function() {
    // Domain protection - only allow on kodevo.info
    const allowedDomains = ['kodevo.info', 'www.kodevo.info', 'localhost', '127.0.0.1'];
    const currentDomain = window.location.hostname;
    
    if (!allowedDomains.includes(currentDomain)) {
        document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Acceso no autorizado</h1><p>Este sistema solo puede ser accedido desde el dominio oficial.</p></div>';
        console.error('Unauthorized domain access attempt');
        return;
    }
    
    // Check if user is logged in before DOM is fully loaded
    const token = localStorage.getItem('adminToken');
    
    // If no token exists, redirect to login page immediately
    if (!token) {
        window.location.replace('login.html');
        return; // Exit the function
    }
    
    // Add event listener for when DOM is loaded to verify token with server
    document.addEventListener('DOMContentLoaded', function() {
        verifyTokenWithServer(token);
        setupLogoutButton();
        setupPageVisibilityCheck();
    });
    
    function verifyTokenWithServer(token) {
        // Show loading indicator
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
        
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        fetch(`api/auth.php?action=check&_=${timestamp}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Requested-Domain': window.location.hostname,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error('Server response not OK:', response.status);
                throw new Error('Authentication failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Auth check response:', data);
            
            if (!data.authenticated) {
                console.error('Token not authenticated by server');
                redirectToLogin();
            } else {
                // Hide loading spinner
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                
                // Show admin content
                const adminContent = document.getElementById('adminContent');
                if (adminContent) {
                    adminContent.style.display = 'block';
                }
                
                // Set session timeout for additional security
                setupSessionTimeout();
                
                // Display username if available
                if (data.username && document.getElementById('adminUsername')) {
                    document.getElementById('adminUsername').textContent = data.username;
                }
                
                console.log('Authentication successful');
            }
        })
        .catch(error => {
            console.error('Authentication check failed:', error);
            
            // Check if we're offline - if so, don't redirect
            if (!navigator.onLine) {
                console.log('Browser is offline, allowing limited access');
                
                // Hide loading spinner
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                
                // Show admin content with limited functionality
                const adminContent = document.getElementById('adminContent');
                if (adminContent) {
                    adminContent.style.display = 'block';
                }
                
                // Show offline message
                const offlineMessage = document.createElement('div');
                offlineMessage.className = 'offline-message';
                offlineMessage.innerHTML = '<strong>Modo sin conexión:</strong> Funcionalidad limitada disponible.';
                document.body.insertBefore(offlineMessage, document.body.firstChild);
                
                return;
            }
            
            redirectToLogin();
        });
    }
    
    function redirectToLogin() {
        // Clear any stored tokens
        localStorage.removeItem('adminToken');
        // Use replace to prevent back button from returning to admin page
        window.location.replace('login.html');
    }
    
    function setupSessionTimeout() {
        // Auto logout after 30 minutes of inactivity
        let inactivityTimer;
        
        function resetTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                alert('Su sesión ha expirado por inactividad.');
                logout();
            }, 30 * 60 * 1000); // 30 minutes
        }
        
        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
        
        // Start the initial timer
        resetTimer();
        
        // Refresh token periodically
        setInterval(() => {
            refreshToken();
        }, 15 * 60 * 1000); // Every 15 minutes
    }
    
    function refreshToken() {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        fetch('api/auth.php?action=refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.token) {
                localStorage.setItem('adminToken', data.token);
            }
        })
        .catch(error => {
            console.error('Token refresh failed:', error);
            // Don't log out on refresh failure, will try again later
        });
    }
    
    function setupLogoutButton() {
        // Set up logout button if it exists
        const logoutBtn = document.getElementById('logoutButton');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
    
    function logout() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            redirectToLogin();
            return;
        }
        
        // Call logout API
        fetch('api/auth.php?action=logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            // Always redirect to login page, even if the request fails
            redirectToLogin();
        })
        .catch(() => {
            // Always redirect to login page
            redirectToLogin();
        });
    }
    
    function setupPageVisibilityCheck() {
        // Log out when user closes the tab or navigates away
        let lastActivity = Date.now();
        
        // Update last activity time on user interaction
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
            }, true);
        });
        
        // Check if user has been away when they return to the page
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // If user has been away for more than 30 minutes, log them out
                if (Date.now() - lastActivity > 30 * 60 * 1000) {
                    alert('Su sesión ha expirado.');
                    logout();
                }
            }
        });
    }
})();