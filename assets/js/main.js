// Función para renderizar la vista de lista de capítulos
function renderChaptersList(chapters = capitulosData) {
    const container = document.getElementById('chaptersListContainer');
    if (!container) {
        console.error('Contenedor chaptersListContainer no encontrado!');
        return;
    }
    container.innerHTML = '';
    chapters.slice(0, 6).forEach((capitulo, index) => {
        const prioridadColor = {
            'por actualizar': 'danger',
            'nuevo': 'warning',
            'media': 'info'
        };
        const subcapitulosHtml = capitulo.subcapitulos.map(sub => {
            const hasSubsections = sub.subsecciones && sub.subsecciones.length > 0;
            let subseccionesHtml = '';
            if (hasSubsections) {
                subseccionesHtml = `
                    <div class="subseccion-container" id="subsecciones-${sub.codigo}" style="display: none;">
                        ${sub.subsecciones.map(subsec => `
                            <div class="subseccion-item" onclick="window.location.href='./seccion.html?codigo=${subsec.codigo}'">
                                <div class="subseccion-code">Sección ${subsec.codigo}</div>
                                <div class="subseccion-title">${subsec.titulo}</div>
                                <i class="bi bi-arrow-right subseccion-arrow"></i>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            return `
                <div class="subcapitulo-item ${hasSubsections ? 'subcapitulo-with-subsections' : ''}" 
                     onclick="${hasSubsections ? `toggleSubsecciones('${sub.codigo}', event)` : `window.location.href='./seccion.html?codigo=${sub.codigo}'`}">
                    <div class="subcapitulo-code">Sección ${sub.codigo}</div>
                    <div class="subcapitulo-title">${sub.titulo}</div>
                    ${hasSubsections ? 
                        `<i class="bi bi-chevron-right subcapitulo-expand-btn" id="btn-${sub.codigo}"></i>` : 
                        `<i class="bi bi-arrow-right subcapitulo-arrow"></i>`
                    }
                </div>
                ${subseccionesHtml}
            `;
        }).join('');
        const downloadLink = capitulo.codigo === '1'
            ? 'docs/Capitulo1-Manual.pdf'
            : '#';
        const chapterListItem = `
            <div class="chapter-list-item loading" style="animation-delay: ${0.7 + (index * 0.1)}s;">
                <div class="chapter-list-header" onclick="toggleChapterExpansion('chapter-${capitulo.codigo}')">
                    <div class="chapter-list-title">
                        <div class="chapter-list-info">
                            <div class="chapter-list-code">Capítulo ${capitulo.codigo}</div>
                            <div class="chapter-list-name">${capitulo.titulo}</div>
                            <div class="chapter-list-summary">${capitulo.resumen}</div>
                        </div>
                        <div class="chapter-list-meta">
                            <div>
                                <i class="bi bi-files me-1"></i>
                                ${capitulo.documentos} docs
                            </div>
                            <div>
                                <i class="bi bi-calendar3 me-1"></i>
                                ${new Date(capitulo.ultimaActualizacion).toLocaleDateString('es-PR')}
                            </div>
                            <span class="badge bg-${prioridadColor[capitulo.prioridad]} rounded-pill">
                                ${capitulo.prioridad}
                            </span>
                            ${capitulo.codigo === '1' ? `
                            <a href="${downloadLink}" download onclick="event.stopPropagation()" class="btn btn-sm btn-modern" title="Descargar Manual PDF">
                                <i class="bi bi-download"></i>
                            </a>
                            ` : ''}
                        </div>
                        <i class="bi bi-chevron-right chapter-expand-icon" id="icon-chapter-${capitulo.codigo}"></i>
                    </div>
                </div>
                <div class="chapter-subcapitulos" id="chapter-${capitulo.codigo}">
                    ${subcapitulosHtml}
                </div>
            </div>
        `;
        container.innerHTML += chapterListItem;
    });
    console.log('renderChaptersList completado, HTML generado:', container.innerHTML.length, 'caracteres');
}
/**
 * OGP Portal - JavaScript Principal
 * Lógica de interactividad para la página de inicio
 */

// Los capítulos se cargarán dinámicamente desde un archivo JSON externo
let capitulosData = [];

// Variable para controlar la vista actual
let currentView = 'list';

// Función para renderizar las tarjetas de capítulos
function renderChapters(chapters = capitulosData) {
    const container = document.getElementById('chaptersContainer');
    container.innerHTML = '';

    chapters.slice(0, 6).forEach((capitulo, index) => {
        const prioridadColor = {
            'por actualizar': 'danger',
            'nuevo': 'warning',
            'media': 'info'
        };

        // Determinar el enlace de descarga según el capítulo
        const downloadLink = capitulo.codigo === '1'
            ? 'docs/Capitulo1-Manual.pdf'
            : '#';

            const resumenId = `chapter-summary-${capitulo.codigo}`;
            const verMasId = `ver-mas-${capitulo.codigo}`;
            const chapterCard = `
                <div class="chapter-card loading" style="animation-delay: ${0.7 + (index * 0.1)}s;">
                    <div class="chapter-header">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="chapter-code">Capítulo ${capitulo.codigo}</div>
                            <span class="badge bg-${prioridadColor[capitulo.prioridad]} rounded-pill">
                                ${capitulo.prioridad}
                            </span>
                        </div>
                        <h3 class="chapter-title">${capitulo.titulo}</h3>
                        <p class="chapter-summary" id="${resumenId}">${capitulo.resumen}</p>
                    </div>
                    <div class="chapter-body">
                        <div class="chapter-meta">
                            <div class="chapter-docs">
                                <i class="bi bi-files me-1"></i>
                                ${capitulo.documentos} documento${capitulo.documentos !== 1 ? 's' : ''}
                            </div>
                            <div class="chapter-date">
                                <i class="bi bi-calendar3 me-1"></i>
                                ${new Date(capitulo.ultimaActualizacion).toLocaleDateString('es-PR')}
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <a href="javascript:void(0)" onclick="goToSeccion('${capitulo.codigo}')" class="btn btn-primary-modern">
                                <i class="bi bi-arrow-right me-1"></i> Ver Secciones
                            </a>
                            <a href="${downloadLink}" ${capitulo.codigo === '1' ? 'download' : ''} class="btn btn-modern" ${capitulo.codigo !== '1' ? 'style=\"opacity: 0.5; cursor: not-allowed;\"' : ''}>
                                <i class="bi bi-download me-1"></i>
                                Descargar
                            </a>
                        </div>
                    </div>
                </div>
            `;
            setTimeout(() => {
                const resumenEl = document.getElementById(resumenId);
                const verMasEl = document.getElementById(verMasId);
                if (resumenEl && verMasEl) {
                    if (resumenEl.scrollHeight > resumenEl.offsetHeight + 2) {
                        verMasEl.style.display = 'inline-block';
                        verMasEl.onclick = function() {
                            resumenEl.style.webkitLineClamp = 'unset';
                            resumenEl.style.maxHeight = 'none';
                            resumenEl.style.overflow = 'visible';
                            verMasEl.style.display = 'none';
                        };
                    }
                }
            }, 100);
        container.innerHTML += chapterCard;
    });

    console.log('renderChapters completado, HTML generado:', container.innerHTML.length, 'caracteres');
}

// Función para alternar la expansión de capítulos
function toggleChapterExpansion(chapterId) {
    const subcapitulos = document.getElementById(chapterId);
    const icon = document.getElementById(`icon-${chapterId}`);
    
    subcapitulos.classList.toggle('expanded');
    icon.classList.toggle('expanded');
}

// Función para alternar la expansión de sub-secciones
function toggleSubsecciones(subseccionId, event) {
    event.stopPropagation(); // Evitar que se ejecute el click del padre
    
    const subsecciones = document.getElementById(`subsecciones-${subseccionId}`);
    const btn = document.getElementById(`btn-${subseccionId}`);
    
    if (subsecciones.style.display === 'none' || subsecciones.style.display === '') {
        subsecciones.style.display = 'block';
        btn.classList.add('expanded');
    } else {
        subsecciones.style.display = 'none';
        btn.classList.remove('expanded');
    }
}

// Función para cambiar entre vistas
function switchView(viewType) {
    console.log('switchView llamado con tipo:', viewType);
    
    const cardViewBtn = document.getElementById('cardViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const chaptersGrid = document.getElementById('chaptersContainer');
    const chaptersList = document.getElementById('chaptersListContainer');

    if (!cardViewBtn || !listViewBtn || !chaptersGrid || !chaptersList) {
        console.error('Algunos elementos de vista no encontrados:', {
            cardViewBtn, listViewBtn, chaptersGrid, chaptersList
        });
        return;
    }

    currentView = viewType;

    if (viewType === 'cards') {
        console.log('Cambiando a vista de tarjetas');
        cardViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        chaptersGrid.style.display = 'grid';
        chaptersList.classList.remove('active');
        chaptersList.style.display = 'none';
        renderChapters(); // Asegurar que se rendericen las tarjetas
        console.log('Vista de tarjetas activada');
    } else {
        console.log('Cambiando a vista de lista');
        listViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        chaptersGrid.style.display = 'none';
        chaptersList.classList.add('active');
        chaptersList.style.display = 'block';
        renderChaptersList();
        console.log('Vista de lista activada');
    }
}

// Función para filtrar capítulos
function filterChapters(categoria) {
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => pill.classList.remove('active'));
    
    const activePill = document.querySelector(`[data-filter="${categoria}"]`);
    if (activePill) activePill.classList.add('active');

    let filteredChapters;
    if (categoria === 'all') {
        filteredChapters = capitulosData;
    } else {
        filteredChapters = capitulosData.filter(cap => cap.categoria === categoria);
    }

    if (currentView === 'cards') {
        renderChapters(filteredChapters);
    } else {
        renderChaptersList(filteredChapters);
    }
}

// Función para búsqueda global
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.warn('Input de búsqueda no encontrado');
        return;
    }
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            if (currentView === 'cards') {
                renderChapters(capitulosData);
            } else {
                renderChaptersList(capitulosData);
            }
            return;
        }

        const filteredChapters = capitulosData.filter(cap => 
            cap.titulo.toLowerCase().includes(searchTerm) ||
            cap.codigo.toLowerCase().includes(searchTerm) ||
            cap.resumen.toLowerCase().includes(searchTerm) ||
            cap.subcapitulos.some(sub => 
                sub.titulo.toLowerCase().includes(searchTerm) ||
                sub.codigo.toLowerCase().includes(searchTerm) ||
                (sub.subsecciones && sub.subsecciones.some(subsec =>
                    subsec.titulo.toLowerCase().includes(searchTerm) ||
                    subsec.codigo.toLowerCase().includes(searchTerm)
                ))
            )
        );

        if (currentView === 'cards') {
            renderChapters(filteredChapters);
        } else {
            renderChaptersList(filteredChapters);
        }
    });
}

// Función para mostrar guía rápida
function showQuickStart() {
    alert('Funcionalidad de Guía Rápida - En esta demo, puedes navegar por los capítulos y explorar el sistema completo.');
}

// Función para navegar a sección
function goToSeccion(cod) {
    // asegura texto y lo codifica
    const codigo = encodeURIComponent(String(cod ?? ''));
    // construye URL relativo al archivo actual (funciona en localhost, LAN y ngrok)
    const url = new URL('./seccion.html', window.location.href);
    url.searchParams.set('codigo', codigo);
    // navega
    window.location.assign(url.toString());
}


// Event listeners con carga dinámica de capítulos
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Inicializando aplicación...');

    // Cargar capítulos desde el archivo JSON externo
    fetch('assets/data/capitulos.json')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar capitulos.json');
            return response.json();
        })
        .then(data => {
            capitulosData = data;
            // Forzar vista de lista inmediatamente
            setTimeout(() => {
                console.log('Timeout ejecutándose...');
                const listContainer = document.getElementById('chaptersListContainer');
                const gridContainer = document.getElementById('chaptersContainer');
                if (listContainer && gridContainer) {
                    console.log('Contenedores encontrados, inicializando vistas...');
                    // Renderizar ambas vistas para asegurar que tengan contenido
                    renderChapters(capitulosData);
                    renderChaptersList(capitulosData);
                    // Mostrar solo la vista de lista por defecto
                    gridContainer.style.display = 'none';
                    gridContainer.classList.remove('active');
                    listContainer.classList.add('active');
                    listContainer.style.display = 'block';
                    currentView = 'list';
                    console.log('Vistas inicializadas correctamente');
                } else {
                    console.error('Contenedores no encontrados!');
                }
            }, 100);
            // Setup search
            setupSearch();
            // Setup filter pills
            const filterPills = document.querySelectorAll('.filter-pill');
            filterPills.forEach(pill => {
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filter = e.target.getAttribute('data-filter');
                    filterChapters(filter);
                });
            });
            // Setup view toggle buttons
            const listViewBtn = document.getElementById('listViewBtn');
            const cardViewBtn = document.getElementById('cardViewBtn');
            if (listViewBtn) {
                listViewBtn.addEventListener('click', () => {
                    console.log('Botón Lista clickeado');
                    switchView('list');
                });
            }
            if (cardViewBtn) {
                cardViewBtn.addEventListener('click', () => {
                    console.log('Botón Tarjetas clickeado');
                    switchView('cards');
                });
            }
            // Navbar scroll effect
            window.addEventListener('scroll', () => {
                const navbar = document.querySelector('.navbar-modern');
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = 'var(--shadow-lg)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            });
        })
        .catch(error => {
            console.error('Error cargando capítulos:', error);
            // Si falla, muestra un mensaje y no inicializa vistas
        });
});