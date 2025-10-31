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
            'Nuevo': 'warning',
            'media': 'info'
        };
        // Si el capítulo no tiene subcapítulos (como el Capítulo 6), crear un mensaje clickeable
        let subcapitulosHtml = '';
        if (capitulo.subcapitulos && capitulo.subcapitulos.length > 0) {
            subcapitulosHtml = capitulo.subcapitulos.map(sub => {
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
        } else {
            // Para capítulos sin subcapítulos, mostrar un enlace directo
            subcapitulosHtml = `
                <div class="subcapitulo-item" onclick="goToSeccion('${capitulo.codigo}')">
                    <div class="subcapitulo-code">Capítulo ${capitulo.codigo}</div>
                    <div class="subcapitulo-title">Ver contenido completo</div>
                    <i class="bi bi-arrow-right subcapitulo-arrow"></i>
                </div>
            `;
        }
        const downloadLink = capitulo.codigo === '1'
            ? 'docs/Capitulo1-Manual.pdf'
            : capitulo.codigo === '2'
            ? 'docs/Capitulo2-Manual.pdf'
            : capitulo.codigo === '3'
            ? 'docs/Capitulo3-Manual.pdf'
            : capitulo.codigo === '4'
            ? 'docs/Capitulo4-Manual.pdf'
            : capitulo.codigo === '5'
            ? 'docs/Capitulo5-Manual.pdf'
            : capitulo.codigo === '6'
            ? 'docs/Capitulo6-Manual.pdf'
            : '#';
        // Determinar si el capítulo tiene subcapítulos para el comportamiento del header
        const hasSubcapitulos = capitulo.subcapitulos && capitulo.subcapitulos.length > 0;
        const headerAction = hasSubcapitulos 
            ? `toggleChapterExpansion('chapter-${capitulo.codigo}')` 
            : `goToSeccion('${capitulo.codigo}')`;
        
        const chapterListItem = `
            <div class="chapter-list-item loading" style="animation-delay: ${0.7 + (index * 0.1)}s;">
                <div class="chapter-list-header" onclick="${headerAction}">
                    <div class="chapter-list-title">
                        <div class="chapter-list-info">
                            <div class="chapter-list-code">Capítulo ${capitulo.codigo}</div>
                            <div class="chapter-list-name">${capitulo.titulo}</div>
                            <div class="chapter-list-summary">${capitulo.resumen}</div>
                        </div>
                        <div class="chapter-list-meta">
                            <div>
                                <i class="bi bi-list-ol me-1"></i>
                                ${capitulo.secciones} secciones
                            </div>
                            <div>
                                <i class="bi bi-calendar3 me-1"></i>
                                26 de octubre, 2025
                            </div>
                            <span class="badge bg-${prioridadColor[capitulo.prioridad]} rounded-pill">
                                ${capitulo.prioridad}
                            </span>
                            ${(['1', '2', '3', '4', '5', '6'].includes(capitulo.codigo)) ? `
                            <a href="${downloadLink}" download onclick="event.stopPropagation()" class="btn btn-sm btn-modern" title="Descargar Manual PDF">
                                <i class="bi bi-download"></i>
                            </a>
                            ` : ''}
                        </div>
                        ${hasSubcapitulos 
                            ? `<i class="bi bi-chevron-right chapter-expand-icon" id="icon-chapter-${capitulo.codigo}"></i>`
                            : `<i class="bi bi-arrow-right chapter-expand-icon"></i>`
                        }
                    </div>
                </div>
                <div class="chapter-subcapitulos" id="chapter-${capitulo.codigo}" ${!hasSubcapitulos ? 'style="display: block;"' : ''}>
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
            : capitulo.codigo === '2'
            ? 'docs/Capitulo2-Manual.pdf'
            : capitulo.codigo === '3'
            ? 'docs/Capitulo3-Manual.pdf'
            : capitulo.codigo === '4'
            ? 'docs/Capitulo4-Manual.pdf'
            : capitulo.codigo === '5'
            ? 'docs/Capitulo5-Manual.pdf'
            : capitulo.codigo === '6'
            ? 'docs/Capitulo6-Manual.pdf'
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
                                <i class="bi bi-list-ol me-1"></i>
                                ${capitulo.secciones} secci${capitulo.secciones !== 1 ? 'ones' : 'ón'}
                            </div>
                            <div class="chapter-date">
                                <i class="bi bi-calendar3 me-1"></i>
                                26 de octubre, 2025
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <a href="javascript:void(0)" onclick="goToSeccion('${capitulo.codigo}')" class="btn btn-primary-modern">
                                <i class="bi bi-arrow-right me-1"></i> Ver Secciones
                            </a>
                            <a href="${downloadLink}" ${(['1', '2', '3', '4', '5', '6'].includes(capitulo.codigo)) ? 'download' : ''} class="btn btn-modern" ${(!['1', '2', '3', '4', '5', '6'].includes(capitulo.codigo)) ? 'style=\"opacity: 0.5; cursor: not-allowed;\"' : ''}>
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

// Variables globales para la búsqueda
let searchData = [];
let currentSuggestionIndex = -1;
let searchTimeout = null;

// Función para inicializar datos de búsqueda
function initSearchData() {
    searchData = [];
    
    capitulosData.forEach(capitulo => {
        // Agregar capítulo principal
        searchData.push({
            type: 'capitulo',
            codigo: capitulo.codigo,
            titulo: capitulo.titulo,
            subtitulo: `Capítulo ${capitulo.codigo} - ${capitulo.secciones} secciones`,
            categoria: capitulo.categoria,
            searchText: `${capitulo.codigo} ${capitulo.titulo} ${capitulo.resumen}`.toLowerCase()
        });
        
        // Agregar subcapítulos/secciones
        capitulo.subcapitulos.forEach(sub => {
            searchData.push({
                type: 'seccion',
                codigo: sub.codigo,
                titulo: sub.titulo,
                subtitulo: `Sección ${sub.codigo} - Capítulo ${capitulo.codigo}`,
                categoria: capitulo.categoria,
                parentCapitulo: capitulo.codigo,
                searchText: `${sub.codigo} ${sub.titulo} ${capitulo.titulo}`.toLowerCase()
            });
            
            // Agregar subsecciones si existen
            if (sub.subsecciones) {
                sub.subsecciones.forEach(subsec => {
                    searchData.push({
                        type: 'subseccion',
                        codigo: subsec.codigo,
                        titulo: subsec.titulo,
                        subtitulo: `Subsección ${subsec.codigo} - Sección ${sub.codigo}`,
                        categoria: capitulo.categoria,
                        parentCapitulo: capitulo.codigo,
                        parentSeccion: sub.codigo,
                        searchText: `${subsec.codigo} ${subsec.titulo} ${sub.titulo} ${capitulo.titulo}`.toLowerCase()
                    });
                });
            }
        });
    });
}

// Función para buscar sugerencias
function searchSuggestions(query) {
    if (!query || query.length < 1) return [];
    
    const queryLower = query.toLowerCase();
    const results = searchData.filter(item => 
        item.searchText.includes(queryLower) ||
        item.codigo.toLowerCase().includes(queryLower)
    );
    
    // Ordenar resultados por relevancia
    return results.sort((a, b) => {
        const aStartsWith = a.titulo.toLowerCase().startsWith(queryLower);
        const bStartsWith = b.titulo.toLowerCase().startsWith(queryLower);
        const aCodeMatch = a.codigo.toLowerCase() === queryLower;
        const bCodeMatch = b.codigo.toLowerCase() === queryLower;
        
        if (aCodeMatch && !bCodeMatch) return -1;
        if (!aCodeMatch && bCodeMatch) return 1;
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Por tipo: capítulos primero, luego secciones, luego subsecciones
        const typeOrder = { capitulo: 1, seccion: 2, subseccion: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
    }).slice(0, 8); // Limitar a 8 sugerencias
}

// Función para crear o obtener el portal de sugerencias
function getSuggestionsPortal() {
    let portal = document.getElementById('searchSuggestionsPortal');
    if (!portal) {
        portal = document.createElement('div');
        portal.id = 'searchSuggestionsPortal';
        portal.className = 'search-suggestions-portal';
        document.body.appendChild(portal);
    }
    return portal;
}

// Función para posicionar el portal de sugerencias
function positionSuggestionsPortal() {
    const searchInput = document.getElementById('searchInput');
    const portal = getSuggestionsPortal();
    
    if (!searchInput) return;
    
    const rect = searchInput.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    portal.style.position = 'fixed';
    portal.style.top = (rect.bottom + 8) + 'px';
    portal.style.left = rect.left + 'px';
    portal.style.width = rect.width + 'px';
    portal.style.zIndex = '999999';
}

// Función para renderizar sugerencias
function renderSuggestions(suggestions) {
    const query = document.getElementById('searchInput').value.trim();
    const portal = getSuggestionsPortal();
    
    // Posicionar el portal correctamente
    positionSuggestionsPortal();
    
    if (!suggestions.length) {
        if (query.length >= 2) {
            // Mostrar mensaje de "no resultados" si hay una búsqueda de al menos 2 caracteres
            portal.innerHTML = `
                <div class="suggestions-container">
                    <div class="suggestion-item" style="cursor: default; opacity: 0.7;">
                        <div class="suggestion-icon" style="background: linear-gradient(135deg, #9CA3AF, #6B7280);">
                            <i class="bi bi-search"></i>
                        </div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">No se encontraron resultados</div>
                            <div class="suggestion-subtitle">Intenta con otros términos de búsqueda</div>
                        </div>
                    </div>
                </div>
            `;
            portal.classList.add('show');
        } else {
            portal.classList.remove('show');
        }
        return;
    }
    
    const html = suggestions.map((item, index) => {
        const iconColor = getIconColor(item.type);
        const icon = getIcon(item.type);
        
        return `
            <div class="suggestion-item" data-index="${index}" data-item='${JSON.stringify(item)}'>
                <div class="suggestion-icon" style="background: ${iconColor};">
                    <i class="bi bi-${icon}"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${highlightMatch(item.titulo, document.getElementById('searchInput').value)}</div>
                    <div class="suggestion-subtitle">${item.subtitulo}</div>
                </div>
                <div class="suggestion-type">${item.type}</div>
            </div>
        `;
    }).join('');
    
    portal.innerHTML = `<div class="suggestions-container">${html}</div>`;
    portal.classList.add('show');
    currentSuggestionIndex = -1;
}

// Función para obtener color del ícono según tipo
function getIconColor(type) {
    const colors = {
        capitulo: 'linear-gradient(135deg, #3182CE, #2C5AA0)',
        seccion: 'linear-gradient(135deg, #38A169, #2F855A)', 
        subseccion: 'linear-gradient(135deg, #D69E2E, #B7791F)'
    };
    return colors[type] || colors.seccion;
}

// Función para obtener ícono según tipo
function getIcon(type) {
    const icons = {
        capitulo: 'journal-bookmark',
        seccion: 'list-ul',
        subseccion: 'chevron-right'
    };
    return icons[type] || icons.seccion;
}

// Función para resaltar coincidencias
function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Función para manejar la navegación con teclado
function handleKeyboardNavigation(e) {
    const portal = document.getElementById('searchSuggestionsPortal');
    const suggestions = portal ? portal.querySelectorAll('.suggestion-item') : [];
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, suggestions.length - 1);
            updateActiveSuggestion();
            break;
        case 'ArrowUp':
            e.preventDefault();
            currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
            updateActiveSuggestion();
            break;
        case 'Enter':
            e.preventDefault();
            if (currentSuggestionIndex >= 0 && suggestions[currentSuggestionIndex]) {
                selectSuggestion(suggestions[currentSuggestionIndex]);
            } else {
                performSearch();
            }
            break;
        case 'Escape':
            hideSuggestions();
            break;
    }
}

// Función para actualizar la sugerencia activa
function updateActiveSuggestion() {
    const portal = document.getElementById('searchSuggestionsPortal');
    if (portal) {
        const suggestions = portal.querySelectorAll('.suggestion-item');
        suggestions.forEach((item, index) => {
            item.classList.toggle('active', index === currentSuggestionIndex);
        });
    }
}

// Función para seleccionar una sugerencia
function selectSuggestion(suggestionElement) {
    const itemData = JSON.parse(suggestionElement.dataset.item);
    
    // Si es un capítulo, navegar a la vista de capítulos
    if (itemData.type === 'capitulo') {
        goToSeccion(itemData.codigo);
    } else {
        // Si es una sección o subsección, navegar a seccion.html
        window.location.href = `seccion.html?capitulo=${itemData.parentCapitulo}&seccion=${itemData.codigo}`;
    }
    
    hideSuggestions();
}

// Función para ocultar sugerencias
function hideSuggestions() {
    const portal = document.getElementById('searchSuggestionsPortal');
    if (portal) {
        portal.classList.remove('show');
    }
    currentSuggestionIndex = -1;
}

// Función para realizar búsqueda cuando se presiona Enter
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (query.length === 0) {
        if (currentView === 'cards') {
            renderChapters(capitulosData);
        } else {
            renderChaptersList(capitulosData);
        }
        return;
    }

    const filteredChapters = capitulosData.filter(cap => 
        cap.titulo.toLowerCase().includes(query) ||
        cap.codigo.toLowerCase().includes(query) ||
        cap.resumen.toLowerCase().includes(query) ||
        cap.subcapitulos.some(sub => 
            sub.titulo.toLowerCase().includes(query) ||
            sub.codigo.toLowerCase().includes(query) ||
            (sub.subsecciones && sub.subsecciones.some(subsec =>
                subsec.titulo.toLowerCase().includes(query) ||
                subsec.codigo.toLowerCase().includes(query)
            ))
        )
    );

    if (currentView === 'cards') {
        renderChapters(filteredChapters);
    } else {
        renderChaptersList(filteredChapters);
    }
    
    hideSuggestions();
}

// Función principal de configuración de búsqueda
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchInput) {
        console.warn('Input de búsqueda no encontrado');
        return;
    }
    
    // Inicializar datos de búsqueda
    initSearchData();
    
    // Evento de input para mostrar sugerencias con debounce
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        // Limpiar timeout anterior
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        if (query.length === 0) {
            hideSuggestions();
            // Mostrar todos los capítulos cuando no hay búsqueda
            if (currentView === 'cards') {
                renderChapters(capitulosData);
            } else {
                renderChaptersList(capitulosData);
            }
            return;
        }
        
        // Agregar pequeño delay para mejorar performance
        searchTimeout = setTimeout(() => {
            const suggestions = searchSuggestions(query);
            renderSuggestions(suggestions);
        }, 150);
    });
    
    // Navegación con teclado
    searchInput.addEventListener('keydown', handleKeyboardNavigation);
    
    // Click en sugerencias del portal
    document.addEventListener('click', (e) => {
        if (e.target.closest('#searchSuggestionsPortal .suggestion-item')) {
            selectSuggestion(e.target.closest('.suggestion-item'));
        } else if (!e.target.closest('.search-container') && !e.target.closest('#searchSuggestionsPortal')) {
            hideSuggestions();
        }
    });
    
    // Reposicionar o ocultar sugerencias al hacer scroll/resize
    document.addEventListener('scroll', () => {
        const portal = document.getElementById('searchSuggestionsPortal');
        if (portal && portal.classList.contains('show')) {
            positionSuggestionsPortal();
        }
    });
    
    window.addEventListener('resize', () => {
        const portal = document.getElementById('searchSuggestionsPortal');
        if (portal && portal.classList.contains('show')) {
            positionSuggestionsPortal();
        }
    });
}

// Función para mostrar guía rápida
function showQuickStart() {
    // Crear modal de guía rápida
    const quickStartModal = `
        <div class="modal fade" id="quickStartModal" tabindex="-1" aria-labelledby="quickStartModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="border: none; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 16px 16px 0 0; padding: 2rem; border: none;">
                        <div>
                            <h4 class="modal-title text-white mb-2" id="quickStartModalLabel">
                                <i class="bi bi-compass me-3" style="font-size: 1.5rem;"></i>Índice General del Manual
                            </h4>
                            <p class="text-white-50 mb-0">Navegación rápida por los capítulos y secciones principales</p>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="font-size: 1.2rem;"></button>
                    </div>
                    <div class="modal-body" style="padding: 2.5rem; background: #fafbfc;">
                        
                        <!-- Sección de Capítulos Principales -->
                        <div class="mb-5">
                            <div class="d-flex align-items-center mb-4">
                                <div class="me-3" style="width: 4px; height: 40px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 2px;"></div>
                                <h5 class="mb-0 text-dark fw-bold">Capítulos del Manual OGP</h5>
                            </div>
                            
                            <div class="row g-4">
                                <!-- Capítulo 1 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('1')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-white fw-bold">1</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Información General del Manual</h6>
                                                    <p class="card-text text-muted small mb-3">Propósito, estructura y terminología fundamental</p>
                                                    <div class="d-flex align-items-center" style="color: #4a5568;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">3 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capítulo 2 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('2')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #718096, #4a5568); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-white fw-bold">2</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Contexto del Proceso Presupuestario</h6>
                                                    <p class="card-text text-muted small mb-3">PROMESA, enfoque multianual y etapas del proceso</p>
                                                    <div class="d-flex align-items-center" style="color: #718096;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">3 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capítulo 3 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('3')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #a0aec0, #718096); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-white fw-bold">3</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Políticas Fiscales y Presupuestarias</h6>
                                                    <p class="card-text text-muted small mb-3">Alineación gubernamental, riesgos y fondos especiales</p>
                                                    <div class="d-flex align-items-center" style="color: #a0aec0;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">6 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capítulo 4 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('4')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #cbd5e0, #a0aec0); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-dark fw-bold">4</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Normas para Petición Presupuestaria</h6>
                                                    <p class="card-text text-muted small mb-3">OPEX, Payroll, CAPEX y procedimientos detallados</p>
                                                    <div class="d-flex align-items-center" style="color: #cbd5e0;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">3 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capítulo 5 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('5')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #e2e8f0, #cbd5e0); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-dark fw-bold">5</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Procedimiento de Presentación</h6>
                                                    <p class="card-text text-muted small mb-3">Instrucciones técnicas EPM, formularios y narrativos</p>
                                                    <div class="d-flex align-items-center" style="color: #cbd5e0;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">4 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Capítulo 6 -->
                                <div class="col-lg-6">
                                    <div class="card h-100 border-0 shadow-sm hover-card" onclick="quickNavigate('6')" style="cursor: pointer; border-radius: 12px; transition: all 0.3s ease;">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-start">
                                                <div class="me-3" style="width: 50px; height: 50px; background: linear-gradient(135deg, #f7fafc, #e2e8f0); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-dark fw-bold">6</span>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="card-title fw-bold text-dark mb-2">Control y Monitoreo</h6>
                                                    <p class="card-text text-muted small mb-3">Sistema SID, supervisión y cumplimiento normativo</p>
                                                    <div class="d-flex align-items-center" style="color: #a0aec0;">
                                                        <i class="bi bi-arrow-right me-1"></i>
                                                        <small class="fw-medium">3 secciones principales</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sección de Acciones Rápidas -->
                        <div style="border-top: 2px solid #e2e8f0; padding-top: 2rem;">
                            <div class="d-flex align-items-center mb-4">
                                <div class="me-3" style="width: 4px; height: 40px; background: linear-gradient(135deg, #718096, #4a5568); border-radius: 2px;"></div>
                                <h5 class="mb-0 text-dark fw-bold">Acciones Rápidas</h5>
                            </div>
                            
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <button class="btn w-100 py-3" onclick="scrollToChapters(); closeModal('quickStartModal');" style="border-radius: 12px; border: 2px solid #4a5568; color: #4a5568; background: transparent;">
                                        <i class="bi bi-list-ul me-2" style="font-size: 1.2rem;"></i>
                                        <div>
                                            <div class="fw-bold">Ver Todos los Capítulos</div>
                                            <small class="text-muted">Explorar estructura completa</small>
                                        </div>
                                    </button>
                                </div>
                                <div class="col-md-4">
                                    <a href="docs/Capitulo1-Manual.pdf" download class="btn w-100 py-3 text-decoration-none" style="border-radius: 12px; border: 2px solid #718096; color: #718096; background: transparent;">
                                        <i class="bi bi-download me-2" style="font-size: 1.2rem;"></i>
                                        <div>
                                            <div class="fw-bold">Descargar Manual</div>
                                            <small class="text-muted">Archivo PDF oficial</small>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn w-100 py-3" onclick="document.getElementById('searchInput')?.focus(); closeModal('quickStartModal');" style="border-radius: 12px; border: 2px solid #a0aec0; color: #a0aec0; background: transparent;">
                                        <i class="bi bi-search me-2" style="font-size: 1.2rem;"></i>
                                        <div>
                                            <div class="fw-bold">Buscar Contenido</div>
                                            <small class="text-muted">Búsqueda inteligente</small>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .hover-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            }
        </style>
    `;
    
    // Agregar modal al DOM si no existe
    if (!document.getElementById('quickStartModal')) {
        document.body.insertAdjacentHTML('beforeend', quickStartModal);
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('quickStartModal'));
    modal.show();
}

// Función para navegación rápida desde el modal
function quickNavigate(chapterCode) {
    goToSeccion(chapterCode);
    closeModal('quickStartModal');
}

// Función para cerrar modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }
}

// Función para scroll suave a capítulos
function scrollToChapters() {
    const chaptersSection = document.querySelector('.main-content');
    if (chaptersSection) {
        chaptersSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // Activar vista de lista automáticamente
        setTimeout(() => {
            switchView('list');
        }, 800);
    }
}

// Función para navegar a sección
function goToSeccion(cod) {
    // Si es el Capítulo 6 (que no tiene subsecciones), ir directamente al modal
    if (cod === '6') {
        // Navegar a seccion.html con código 6.1 (primera sección) para activar el modal del capítulo 6
        const url = new URL('./seccion.html', window.location.href);
        url.searchParams.set('codigo', '6.1');
        window.location.assign(url.toString());
        return;
    }
    
    // Para otros capítulos, comportamiento normal
    const codigo = encodeURIComponent(String(cod ?? ''));
    const url = new URL('./seccion.html', window.location.href);
    url.searchParams.set('codigo', codigo);
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