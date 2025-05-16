document.addEventListener('DOMContentLoaded', function() {
    // Domain protection - only allow on kodevo.info
    const allowedDomains = ['kodevo.info', 'www.kodevo.info', 'localhost', '127.0.0.1'];
    const currentDomain = window.location.hostname;
    
    if (!allowedDomains.includes(currentDomain)) {
        document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Acceso no autorizado</h1><p>Este sistema solo puede ser accedido desde el dominio oficial.</p></div>';
        console.error('Unauthorized domain access attempt');
        return;
    }
    
    // Clear any existing tokens to ensure fresh authentication
    localStorage.removeItem('adminToken');
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validate inputs
            if (!username || !password) {
                showError('Por favor ingrese usuario y contraseña');
                return;
            }
            
            // Disable form during submission
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Verificando...';
            
            // Send login request
            fetch('api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-Domain': window.location.hostname // Send domain for server-side verification
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    domain: window.location.hostname, // Include domain in request body
                    // Add a random request ID to prevent replay attacks
                    requestId: generateRandomId()
                })
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 429) {
                        // Too many attempts
                        return response.json().then(data => {
                            throw new Error(data.message || 'Demasiados intentos. Intente más tarde.');
                        });
                    }
                    return response.json().then(data => {
                        throw new Error(data.message || 'Credenciales inválidas');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Store token and redirect
                    localStorage.setItem('adminToken', data.token);
                    
                    // Add a small delay to ensure token is stored before redirect
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 100);
                } else {
                    showError(data.message || 'Error de autenticación');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showError(error.message || 'Error de conexión. Intente nuevamente.');
            })
            .finally(() => {
                // Re-enable form
                submitButton.disabled = false;
                submitButton.textContent = 'Iniciar Sesión';
            });
        });
    }
    
    // Add password visibility toggle
    const passwordField = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    
    if (passwordField && togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});

function showError(message) {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Shake animation for better user feedback
        errorElement.classList.add('shake');
        setTimeout(() => {
            errorElement.classList.remove('shake');
        }, 500);
    }
}

function generateRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}