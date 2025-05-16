// menu.js

document.addEventListener('DOMContentLoaded', function() {
    'use strict'; // Modo estricto para evitar errores comunes

    // 1. Selecciones de elementos del DOM
    // Guarda los elementos del DOM en variables para evitar múltiples consultas costosas.
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section'); // Selecciona todas las secciones
    
    // Verifica si los elementos necesarios existen antes de continuar.
    if (!hamburger || !navMenu) {
        console.error('Error: Elementos del menú no encontrados. Asegúrate de que .hamburger-menu y .nav-menu estén presentes en el HTML.');
        return; // Detiene la ejecución si los elementos no existen.
    }

    // 2. Funcionalidad del menú móvil
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // 3. Cerrar el menú al hacer clic en los enlaces (móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(); // Reusa la función para cerrar el menú
        });
    });

    // 4. Cerrar el menú al hacer clic fuera del menú
    document.addEventListener('click', (event) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !hamburger.contains(event.target)) {
            toggleMobileMenu(); // Reusa la función para cerrar el menú
        }
    });

    // 5. Resaltado de la sección activa al hacer scroll
    function highlightActiveSection() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Verifica si la sección está en el viewport
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Usa el atributo href del enlace directamente para la comparación.
            if (link.getAttribute('href').slice(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
});
