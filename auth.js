/* ==========================================
   LUMI - AUTH.JS (REHECHO)
   Sistema de login y registro
   ========================================== */

// Base de datos en memoria
let users = [];
let currentUser = null;

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Lumi Auth - Cargado');
    
    // Inicializar Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide icons inicializados');
    }
    
    // Cargar usuario de prueba
    loadTestUser();
    
    // Inicializar sistema
    initTabs();
    initPasswordToggles();
    initForms();
    
    console.log('✅ Sistema de auth listo');
});

// ==========================================
// TABS - Login / Registro
// ==========================================
function initTabs() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (!tabLogin || !tabRegister) {
        console.error('❌ No se encontraron los tabs');
        return;
    }
    
    console.log('📑 Inicializando tabs de auth');
    
    // Click en Login
    tabLogin.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('👆 Click en tab Login');
        
        // Activar tab
        tabLogin.classList.add('tab-active');
        tabRegister.classList.remove('tab-active');
        
        // Mostrar/ocultar forms
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        
        clearErrors();
        
        // Recrear iconos
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
    
    // Click en Registro
    tabRegister.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('👆 Click en tab Registro');
        
        // Activar tab
        tabRegister.classList.add('tab-active');
        tabLogin.classList.remove('tab-active');
        
        // Mostrar/ocultar forms
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        
        clearErrors();
        
        // Recrear iconos
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
    
    console.log('✅ Tabs inicializados');
}

// ==========================================
// PASSWORD TOGGLES
// ==========================================
function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    console.log('👁️ Password toggles encontrados:', toggles.length);
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (!input || !icon) return;
            
            // Toggle tipo
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            
            // Recrear iconos
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
    
    console.log('✅ Password toggles inicializados');
}

// ==========================================
// FORMS
// ==========================================
function initForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form inicializado');
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('✅ Register form inicializado');
    }
}

// ==========================================
// LOGIN
// ==========================================
function handleLogin(e) {
    e.preventDefault();
    console.log('🔑 Procesando login...');
    
    clearErrors();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('remember-me').checked;
    
    // Validar
    let valid = true;
    
    if (!validateEmail(email)) {
        showError('login-email-error', 'Email inválido');
        valid = false;
    }
    
    if (password.length < 6) {
        showError('login-password-error', 'Mínimo 6 caracteres');
        valid = false;
    }
    
    if (!valid) return;
    
    // Buscar usuario
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError('login-email-error', 'No existe una cuenta con este email');
        return;
    }
    
    if (user.password !== password) {
        showError('login-password-error', 'Contraseña incorrecta');
        return;
    }
    
    // Login exitoso
    console.log('✅ Login exitoso:', email);
    currentUser = user;
    
    showNotification('¡Bienvenido de vuelta!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ==========================================
// REGISTRO
// ==========================================
function handleRegister(e) {
    e.preventDefault();
    console.log('📝 Procesando registro...');
    
    clearErrors();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Validar
    let valid = true;
    
    if (name.length < 2) {
        showError('register-name-error', 'Nombre muy corto');
        valid = false;
    }
    
    if (!validateEmail(email)) {
        showError('register-email-error', 'Email inválido');
        valid = false;
    }
    
    if (password.length < 8) {
        showError('register-password-error', 'Mínimo 8 caracteres');
        valid = false;
    }
    
    if (password !== confirm) {
        showError('register-confirm-error', 'Las contraseñas no coinciden');
        valid = false;
    }
    
    if (!valid) return;
    
    // Verificar email duplicado
    if (users.find(u => u.email === email)) {
        showError('register-email-error', 'Este email ya está registrado');
        return;
    }
    
    // Crear usuario
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    console.log('✅ Usuario registrado:', email);
    
    showNotification('¡Cuenta creada con éxito!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ==========================================
// VALIDACIÓN
// ==========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==========================================
// ERRORES
// ==========================================
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        
        const input = errorEl.previousElementSibling?.querySelector('.form-input');
        if (input) {
            input.style.borderColor = 'var(--coral)';
        }
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
    });
}

// ==========================================
// NOTIFICACIONES
// ==========================================
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--teal)' : 'var(--coral)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ==========================================
// TEST USER
// ==========================================
function loadTestUser() {
    users.push({
        id: 'user_test',
        name: 'Usuario Prueba',
        email: 'test@lumi.com',
        password: '12345678',
        createdAt: new Date().toISOString()
    });
    
    console.log('📊 Usuario de prueba cargado');
    console.log('📧 Email: test@lumi.com');
    console.log('🔑 Password: 12345678');
}