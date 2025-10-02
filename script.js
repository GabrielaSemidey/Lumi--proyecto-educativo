// ===== INICIALIZAR ICONOS DE LUCIDE =====
// Este script inicializa todos los iconos de Lucide en la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todos los iconos de Lucide
  lucide.createIcons();
  
  console.log('🎨 Lumi Landing Page cargada correctamente');
});

// ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
// Cuando haces click en los links del nav, hace scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== ANIMACIÓN DE SCROLL PARA ELEMENTOS =====
// Hace que los elementos aparezcan con fade-in cuando haces scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar todas las cards, roles y planes
const animatedElements = document.querySelectorAll('.card, .role-card, .plan-card, .step-card');
animatedElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

// ===== EFECTO PARALLAX SUAVE EN BACKGROUND BLOBS =====
// Los blobs del fondo se mueven un poquito cuando mueves el mouse
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
  
  // Mover los blobs basado en la posición del mouse
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, index) => {
    const speed = (index + 1) * 0.5; // Diferentes velocidades para cada blob
    const x = mouseX * 30 * speed;
    const y = mouseY * 30 * speed;
    
    blob.style.transform = `translate(${x}px, ${y}px)`;
    blob.style.transition = 'transform 0.5s ease-out';
  });
});

// ===== HEADER SCROLL EFFECT =====
// El header cambia de estilo cuando haces scroll
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    header.style.background = 'rgba(15, 23, 42, 0.9)';
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  } else {
    header.style.background = 'rgba(15, 23, 42, 0.7)';
    header.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// ===== BOTONES CON EFECTOS =====
// Agregar efectos de ripple a los botones cuando se hace click
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Agregar el efecto a todos los botones
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.addEventListener('click', createRipple);
});

// CSS para el efecto ripple (lo agregamos dinámicamente)
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== ANIMACIÓN ESPECIAL PARA LAS CARDS DEL HERO =====
// Las cards del hero tienen un efecto de flotación
const heroCards = document.querySelectorAll('.hero-cards .card');
heroCards.forEach((card, index) => {
  // Cada card tiene un delay diferente para el efecto flotante
  const delay = index * 0.2;
  card.style.animation = `float 3s ease-in-out ${delay}s infinite`;
});

// CSS para la animación de flotación
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(floatStyle);

// ===== CONTADOR ANIMADO PARA PRECIOS (opcional) =====
// Si quieres animar los números de los precios
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = `${value}/mes`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Observador para animar los precios cuando aparecen en pantalla
const priceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      entry.target.classList.add('animated');
      const priceText = entry.target.textContent;
      const priceValue = parseInt(priceText.replace(/\D/g, ''));
      
      if (priceValue > 0) {
        animateValue(entry.target, 0, priceValue, 1000);
      }
    }
  });
}, { threshold: 0.5 });

// Observar todos los precios
const prices = document.querySelectorAll('.plan-price');
prices.forEach(price => {
  if (price.textContent.includes('€')) {
    priceObserver.observe(price);
  }
});

// ===== EFECTO TILT EN CARDS =====
// Las cards se inclinan ligeramente cuando pasas el mouse
function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(event) {
  const card = event.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// Aplicar efecto tilt a todas las cards
const tiltCards = document.querySelectorAll('.card, .role-card, .plan-card');
tiltCards.forEach(card => {
  card.style.transition = 'transform 0.1s ease-out';
  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

// ===== PARTÍCULAS DE FONDO (opcional, efecto sutil) =====
// Crea pequeñas partículas que flotan en el fondo
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 3 + 1;
  const startX = Math.random() * window.innerWidth;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;
  
  particle.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background: rgba(34, 211, 238, 0.3);
    border-radius: 50%;
    left: ${startX}px;
    bottom: -10px;
    pointer-events: none;
    z-index: -5;
    animation: float-up ${duration}s linear ${delay}s infinite;
  `;
  
  document.body.appendChild(particle);
}

// CSS para animación de partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes float-up {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.5;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(particleStyle);

// Crear algunas partículas (no muchas para no sobrecargar)
for (let i = 0; i < 20; i++) {
  createParticle();
}

// ===== LAZY LOADING PARA IMÁGENES (por si agregas imágenes después) =====
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

// Observar todas las imágenes con data-src
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ===== EASTER EGG: MODO NOCTURNO EXTRA =====
// Si haces click 5 veces en el logo, activa un modo especial
let clickCount = 0;
const logo = document.querySelector('.logo');

logo.addEventListener('click', function() {
  clickCount++;
  
  if (clickCount === 5) {
    document.body.classList.toggle('easter-egg-mode');
    clickCount = 0;
    
    // Agregar estilos para el easter egg
    if (!document.querySelector('#easter-egg-styles')) {
      const easterStyle = document.createElement('style');
      easterStyle.id = 'easter-egg-styles';
      easterStyle.textContent = `
        .easter-egg-mode {
          animation: rainbow-background 5s ease infinite;
        }
        
        @keyframes rainbow-background {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(easterStyle);
    }
    
    console.log('🎉 ¡Easter egg activado!');
  }
  
  // Reset después de 2 segundos
  setTimeout(() => {
    clickCount = 0;
  }, 2000);
});

// ===== STATS ANIMADOS (si quieres agregar estadísticas después) =====
function animateStats() {
  const stats = document.querySelectorAll('[data-stat]');
  
  stats.forEach(stat => {
    const finalValue = parseInt(stat.dataset.stat);
    const duration = 2000;
    const increment = finalValue / (duration / 16);
    let currentValue = 0;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        stat.textContent = finalValue.toLocaleString();
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(currentValue).toLocaleString();
      }
    }, 16);
  });
}

// ===== PERFORMANCE: REDUCIR ANIMACIONES EN MÓVIL =====
// Detectar si es móvil y reducir efectos pesados
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  // Desactivar parallax en móvil
  document.removeEventListener('mousemove', function() {});
  
  // Reducir partículas
  document.querySelectorAll('.particle').forEach((particle, index) => {
    if (index > 5) particle.remove();
  });
  
  console.log('📱 Modo móvil: efectos optimizados');
}

// ===== ACCESIBILIDAD: REDUCIR MOVIMIENTO SI EL USUARIO LO PREFIERE =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Desactivar todas las animaciones
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('♿ Modo de movimiento reducido activado');
}

// ===== LOG DE BIENVENIDA EN CONSOLA =====
console.log('%c✨ Lumi Landing Page', 'color: #22d3ee; font-size: 24px; font-weight: bold;');
console.log('%cCreado con ❤️ para exploradores del conocimiento', 'color: #a855f7; font-size: 14px;');
console.log('%c🎯 Tip: Haz click 5 veces en el logo para un easter egg', 'color: #ec4899; font-size: 12px;');

// ===== FUNCIONES ÚTILES PARA DEBUG =====
// Estas funciones las puedes usar en la consola del navegador
window.lumiDebug = {
  // Muestra información sobre el scroll
  scrollInfo: () => {
    console.log('Scroll position:', window.pageYOffset);
    console.log('Window height:', window.innerHeight);
    console.log('Document height:', document.body.scrollHeight);
  },
  
  // Muestra todas las cards visibles
  visibleCards: () => {
    const cards = document.querySelectorAll('.card, .role-card, .plan-card');
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      console.log(`Card ${index}:`, isVisible ? '✅ Visible' : '❌ No visible');
    });
  },
  
  // Resetea todas las animaciones
  resetAnimations: () => {
    location.reload();
  }
};
