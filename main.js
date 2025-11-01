/* ==========================================
   LUMI - MAIN.JS (REHECHO)
   JavaScript para landing page
   ========================================== */

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Lumi Main - Cargado');
    
    // Inicializar Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide icons inicializados');
    }
    
    // Inicializar funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initRouteTabs();
});

// ==========================================
// ROUTE TABS - Sistema de tabs de perfiles
// ==========================================
function initRouteTabs() {
    const tabs = document.querySelectorAll('.route-tab');
    const previews = document.querySelectorAll('.route-preview');
    
    if (tabs.length === 0) {
        console.log('ℹ️ No hay tabs de perfiles (normal en página de login)');
        return;
    }
    
    console.log('📑 Inicializando tabs de perfiles:', tabs.length);
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            const profile = this.getAttribute('data-profile');
            console.log('👆 Click en perfil:', profile);
            
            // Remover active de todos
            tabs.forEach(t => t.classList.remove('active'));
            previews.forEach(p => p.classList.remove('active'));
            
            // Activar el seleccionado
            this.classList.add('active');
            
            const targetPreview = document.getElementById(`preview-${profile}`);
            if (targetPreview) {
                targetPreview.classList.add('active');
                console.log('✅ Preview activado:', profile);
                
                // Recrear iconos en el nuevo preview
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                console.error('❌ No se encontró preview:', `preview-${profile}`);
            }
        });
    });
    
    console.log('✅ Tabs de perfiles inicializados');
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (!btn || !menu) {
        console.log('ℹ️ No hay menú móvil (normal en página de login)');
        return;
    }
    
    console.log('📱 Inicializando menú móvil');
    
    // Toggle menu
    btn.addEventListener('click', () => {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        } else {
            menu.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Cerrar al hacer click en link
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && 
            !btn.contains(e.target) && 
            menu.classList.contains('active')) {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
    
    console.log('✅ Menú móvil inicializado');
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Accesibilidad
                target.setAttribute('tabindex', '-1');
                target.focus();
                
                target.addEventListener('blur', () => {
                    target.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });
    
    console.log('✅ Smooth scroll inicializado');
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(callback, options);
    
    const elements = document.querySelectorAll('.card, .route-tab, .section-header-center, .benefit-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
    
    console.log('✅ Scroll animations inicializadas:', elements.length, 'elementos');
}

/* ==========================================
   LUMI - TIENDA.JS
   Funcionalidad de la tienda
   ========================================== */

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Tienda - Cargada');
    
    // Inicializar filtros
    initFilters();
    
    // Cargar balance del usuario
    loadUserBalance();
    
    console.log('✅ Tienda lista');
});

// ==========================================
// FILTROS DE CATEGORÍAS
// ==========================================
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const rewardCards = document.querySelectorAll('.reward-card');
    
    if (filterButtons.length === 0) {
        console.log('ℹ️ No hay filtros disponibles');
        return;
    }
    
    console.log('🔍 Inicializando filtros');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar cards
            filterRewards(category, rewardCards);
            
            console.log('📁 Filtro aplicado:', category);
        });
    });
    
    console.log('✅ Filtros inicializados');
}

function filterRewards(category, cards) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all') {
            // Mostrar todas
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            // Filtrar por categoría
            if (cardCategory === category) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ==========================================
// CARGAR BALANCE
// ==========================================
function loadUserBalance() {
    // En producción esto vendría de tu backend/API
    const balance = 1250;
    
    // Actualizar displays de balance
    const balanceElements = [
        document.getElementById('balance-amount'),
        document.getElementById('nav-coins')
    ];
    
    balanceElements.forEach(el => {
        if (el) {
            if (el.id === 'nav-coins') {
                el.textContent = formatNumber(balance);
            } else {
                el.textContent = `${formatNumber(balance)} LC`;
            }
        }
    });
    
    // Habilitar/deshabilitar botones según balance
    checkAffordableRewards(balance);
    
    console.log('💰 Balance cargado:', balance, 'LC');
}

function checkAffordableRewards(balance) {
    const rewardCards = document.querySelectorAll('.reward-card');
    
    rewardCards.forEach(card => {
        const price = parseInt(card.getAttribute('data-price'));
        const button = card.querySelector('.btn-reward');
        
        if (!price || !button) return;
        
        // Si el precio es mayor al balance, deshabilitar
        if (price > balance && !button.classList.contains('btn-reward-disabled')) {
            button.classList.add('btn-reward-disabled');
            button.disabled = true;
            button.innerHTML = '<i data-lucide="lock"></i> Insuficiente';
            
            // Recrear iconos
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    });
}

// ==========================================
// CANJEAR RECOMPENSA
// ==========================================
function claimReward(rewardName, price) {
    console.log('🎁 Canjeando:', rewardName, 'por', price, 'LC');
    
    // Aquí iría la lógica de canje real
    // Por ahora solo mostramos una notificación
    
    showNotification(`¡Canjeaste ${rewardName} por ${price} LC!`, 'success');
    
    // Actualizar balance
    const currentBalance = 1250; // Esto vendría de tu estado global
    const newBalance = currentBalance - price;
    loadUserBalance(); // Recargar con nuevo balance
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
        background: ${type === 'success' ? 'var(--teal)' : type === 'error' ? 'var(--coral)' : 'var(--navy)'};
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
// UTILITY FUNCTIONS
// ==========================================
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

console.log('🛍️ tienda.js cargado completamente');