// main.js

// Datos de ejemplo para proyectos
const proyectosEjemplo = [
    {
        id: 1,
        titulo: 'Aplicación Web Responsiva',
        descripcion: 'Desarrollo de una aplicación web completamente responsiva utilizando HTML5, CSS3 y JavaScript.',
        imagen: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
        enlaceDemo: '#',
        enlaceGithub: '#'
    },
    {
        id: 2,
        titulo: 'Tienda Online',
        descripcion: 'E-commerce desarrollado con React y Node.js, incluyendo pasarela de pagos y gestión de inventario.',
        imagen: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
        enlaceDemo: '#',
        enlaceGithub: '#'
    },
    {
        id: 3,
        titulo: 'Aplicación Móvil',
        descripcion: 'App móvil multiplataforma desarrollada con Flutter para gestión de tareas personales.',
        imagen: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
        enlaceDemo: '#',
        enlaceGithub: '#'
    }
];

/**
 * Función para cargar proyectos en la página.
 * Intenta cargar proyectos desde una API, y si falla, utiliza datos de ejemplo.
 */
function cargarProyectos() {
    // 1. Obtener el contenedor de proyectos del DOM.
    const contenedorProyectos = document.querySelector('.projects-grid');

    // 2. Verificar si el contenedor existe. Si no, mostrar un error y terminar.
    if (!contenedorProyectos) {
        console.error('No se encontró el contenedor de proyectos. Asegúrate de que exista un elemento con la clase "projects-grid" en tu HTML.');
        return;
    }

    // 3. Log de que el contenedor fue encontrado.
    console.log('Contenedor de proyectos encontrado, procesando...');

    // 4. Limpiar el contenedor de proyectos.
    contenedorProyectos.innerHTML = '';

    /**
     * Función interna para usar los proyectos de ejemplo.
     * Se llama cuando la API falla o no devuelve datos.
     */
    const usarProyectosEjemplo = () => {
        console.log('Usando proyectos de ejemplo...');
        proyectosEjemplo.forEach(proyecto => {
            const proyectoHTML = `
                <div class="project-item web show animate-on-scroll">
                    <div class="project-img">
                        <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                    </div>
                    <div class="project-info">
                        <h3>${proyecto.titulo}</h3>
                        <p>${proyecto.descripcion}</p>
                        <div class="project-tags">
                            <span>HTML</span>
                            <span>CSS</span>
                            <span>JavaScript</span>
                        </div>
                        <div class="project-links">
                            <a href="${proyecto.enlaceDemo}" class="btn-small"><i class="fas fa-link"></i> Demo</a>
                            <a href="${proyecto.enlaceGithub}" class="btn-small"><i class="fab fa-github"></i> Código</a>
                        </div>
                    </div>
                </div>
            `;
            contenedorProyectos.innerHTML += proyectoHTML;
        });
    };

    // 5. Intentar cargar los proyectos desde la API.
    fetch('/api/v1/public/projects.php')
        .then(response => {
            // 6. Verificar el estado de la respuesta HTTP.
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            return response.json(); // 7. Parsear la respuesta JSON.
        })
        .then(data => {
            // 8. Procesar los datos de la API.
            console.log('Datos recibidos de la API:', data);
            contenedorProyectos.innerHTML = ''; // Limpiar de nuevo, por si acaso.

            if (data && data.success && data.data && data.data.length > 0) {
                // 9. Si la API devuelve datos válidos, renderizarlos.
                data.data.forEach(proyecto => {
                    // 10. Asegurar que las URLs de las imágenes sean absolutas o relativas correctas.
                    const imagenUrl = proyecto.imagen && proyecto.imagen.startsWith('http')
                        ? proyecto.imagen
                        : `/${proyecto.imagen.replace(/^\//, '')}`;  // Previene duplicar la barra inicial

                    const proyectoHTML = `
                        <div class="project-card">
                            <img src="${imagenUrl}" alt="${proyecto.titulo}" class="project-image">
                            <div class="project-info">
                                <h3>${proyecto.titulo}</h3>
                                <p>${proyecto.descripcion}</p>
                                <div class="project-links">
                                    ${proyecto.enlaceDemo ? `<a href="${proyecto.enlaceDemo}" target="_blank">Demo</a>` : ''}
                                    ${proyecto.enlaceGithub ? `<a href="${proyecto.enlaceGithub}" target="_blank">GitHub</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                    contenedorProyectos.innerHTML += proyectoHTML;
                });
            } else {
                // 11. Si la API no devuelve datos o devuelve un error, usar los datos de ejemplo.
                console.warn('La API no devolvió datos válidos. Utilizando proyectos de ejemplo.');
                usarProyectosEjemplo();
            }
        })
        .catch(error => {
            // 12. Capturar errores de la llamada a la API.
            console.error('Error al cargar proyectos desde la API:', error);
            usarProyectosEjemplo(); // 13. Usar datos de ejemplo en caso de error.
        });
}

/**
 * Función para inicializar animaciones al hacer scroll.
 */
function iniciarAnimacionesScroll() {
    const elementosAnimados = document.querySelectorAll('.animate-on-scroll');

    if (elementosAnimados.length === 0) {
        console.warn('No se encontraron elementos para animar. Asegúrate de que existan elementos con la clase "animate-on-scroll".');
        return;
    }

    const checkScroll = () => {
        elementosAnimados.forEach(elemento => {
            const elementoTop = elemento.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementoTop < windowHeight * 0.85) {
                elemento.classList.add('visible');
            }
        });
    };

    // Comprobar la posición inicial al cargar la página.
    checkScroll();

    // Comprobar la posición al hacer scroll.
    window.addEventListener('scroll', checkScroll);
}

/**
 * Función para inicializar el filtro de proyectos.
 */
function inicializarFiltroProyectos() {
    const botonesFilter = document.querySelectorAll('.filter-btn');
    const proyectos = document.querySelectorAll('.project-item');

    if (botonesFilter.length === 0 || proyectos.length === 0) {
        console.warn('No se encontraron botones de filtro o proyectos. Asegúrate de que existan elementos con las clases "filter-btn" y "project-item" en tu HTML.');
        return;
    }

    botonesFilter.forEach(boton => {
        boton.addEventListener('click', function () {
            // Quitar la clase 'active' de todos los botones.
            botonesFilter.forEach(b => b.classList.remove('active'));
            // Añadir la clase 'active' al botón clickeado.
            this.classList.add('active');

            const filtro = this.getAttribute('data-filter');

            proyectos.forEach(proyecto => {
                if (filtro === 'all' || proyecto.classList.contains(filtro)) {
                    proyecto.classList.add('show');
                } else {
                    proyecto.classList.remove('show');
                }
            });
        });
    });
}

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    iniciarAnimacionesScroll();
    inicializarFiltroProyectos();
    cargarProyectos();
});
