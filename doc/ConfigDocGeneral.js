// @ts-nocheck
(() => {
    /** 1. Imports y variables del módulo */
    const { element, insertStyle, buildStyle } = window.FluidUI;
    const regexId = /[?&]id=([^&]+)/ /** extrae id de url */;

    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 770) return;

        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.sidebar-toggle');

        if (!sidebar || !toggle) return;

        const clickedOutside = !sidebar.contains(e.target) && !toggle.contains(e.target);
        const clickedLink = e.target.closest('a');

        if (clickedOutside || clickedLink) {
            document.body.classList.add('close');
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth < 770) setTimeout(() => document.body.classList.add('close'), 10);
    });

    /** 2. Definición de Configuración */
    window.ConfigDocGeneral = {
        /** Buscador */ search: { maxAge: 86400000, paths: 'auto', placeholder: 'Buscar...', noData: 'No se encontraron resultados', depth: 6 },
        /** Zoom */ zoom: { selector: 'img:not(.emoji)', background: '#0f172a', scrollOffset: 0 },
        /** Mermaid */ mermaid: { theme: 'dark', securityLevel: 'loose', flowchart: { defaultRenderer: 'elk' } },
        /** Estilos generales */ topMargin: 90, progress: buildStyle($ => ({ position: $.top, color: $.cssVar("theme-color", "#00FFCC"), height: $.px(3) })),
        /** Plugins */ plugins: [
            function (hook, vm) {
                /** 1. Custom Scroll Spy for Sidebar */
                hook.doneEach(function () {
                    const sidebar = element('.sidebar', false);
                    if (!sidebar) return;
                    /** Header del sidebar */
                    const headerWrapper = element('div.sidebar-header', true).resume();
                    sidebar.prepend(headerWrapper);
                    const title = sidebar.selectOne(':not(.sidebar-header) > h1');
                    const appNav = sidebar.selectOne(':not(.sidebar-header) > .app-nav');
                    const search = sidebar.selectOne(':not(.sidebar-header) > .search');
                    title && headerWrapper.appendChild(title);
                    appNav && headerWrapper.appendChild(appNav);
                    search && headerWrapper.appendChild(search);
                    /** Asegurar posición */
                    if (sidebar.resume().firstChild !== headerWrapper) sidebar.prepend(headerWrapper);
                    /** Comportamiento del Link App Name */
                    const appLink = element('.app-name-link', false);
                    appLink?.onclick((e) => {
                        e.preventDefault();
                        window.scrollTo(0, 0);
                        const url = new URL(window.location);
                        url.searchParams.delete('id');
                        history.pushState(null, '', url);
                    });
                });
                /** 2. Active Link Highlighter */
                hook.doneEach(function () {
                    const [main, sidebar] = element(['.markdown-section', '.sidebar'], false);
                    if (!main || !sidebar) return;
                    let lastActiveId = '';
                    const updateActiveLink = () => {
                        const headers = main.selectAll('h1, h2, h3, h4, h5, h6');
                        let currentId = '', minDiff = Infinity;
                        /** Encontrar header más cercano */
                        headers.forEach(header => {
                            const diff = Math.abs(header.rect.top - 100);
                            if (diff < minDiff) (minDiff = diff), (currentId = header.id());
                        });
                        /** Actualizar si cambió */
                        if (currentId && currentId !== lastActiveId) {
                            lastActiveId = currentId;
                            /** Limpiar activos previos */
                            sidebar.selectAll('li.active, a.active').forEach(el => el.removeClass('active'));
                            /** Buscar link activo */
                            const activeLink = sidebar.selectAll('a[href*="id="]').find(link => {
                                const idMatch = link.attr('href').match(regexId);
                                return idMatch && idMatch[1] && decodeURIComponent(idMatch[1]) === decodeURIComponent(currentId);
                            });
                            if (activeLink) {
                                activeLink.addClass('active');
                                /** Actualizar URL */
                                const url = new URL(window.location);
                                url.searchParams.set('id', currentId);
                                history.replaceState(null, '', url);
                                /** Scroll Sidebar si es necesario */
                                const headerOffset = sidebar.selectOne('.sidebar-header')?.offsetHeight || 0;
                                const linkRect = activeLink.rect;
                                const sidebarRect = sidebar.rect;
                                const bottomOffset = 20;
                                const isOutOfView = linkRect.top < (sidebarRect.top + headerOffset) || linkRect.bottom > (sidebarRect.bottom - bottomOffset);
                                if (isOutOfView) {
                                    const visibleCenter = (sidebar.height - headerOffset) / 2 + headerOffset;
                                    const scrollAmount = (linkRect.top - sidebarRect.top) - visibleCenter + (linkRect.height / 2);
                                    sidebar.scrollY += scrollAmount;
                                }
                                /** Activar padre LI */
                                activeLink.closest('li')?.addClass('active');
                            }
                        }
                    };
                    window.addEventListener('scroll', updateActiveLink);
                    setTimeout(updateActiveLink, 100);
                });
                /** 3. CodeMirror Integration */
                hook.doneEach(function () {
                    document.querySelectorAll('pre[data-lang]').forEach((block) => {
                        if (block.nextElementSibling?.classList.contains('CodeMirror')) return;
                        const code = block.querySelector('code');
                        if (!code) return;
                        const lang = block.getAttribute('data-lang');
                        const modeMap = { js: 'javascript', javascript: 'javascript', json: 'json', ts: 'javascript', typescript: 'javascript', html: 'htmlmixed', css: 'css', xml: 'xml', sql: 'sql', markdown: 'markdown', md: 'markdown', yaml: 'yaml', yml: 'yaml', csharp: 'clike', cs: 'clike', java: 'clike', cpp: 'clike' };
                        const editorContainer = document.createElement('div');
                        block.parentNode.insertBefore(editorContainer, block);
                        block.style.display = 'none';
                        CodeMirror(editorContainer, { value: code.textContent, mode: modeMap[lang] || 'text/plain', theme: 'vscode-dark', lineNumbers: true, readOnly: true, lineWrapping: true });
                    });
                });
                /** 4. Graphviz & Mermaid Rendering Plugin */
                hook.afterEach(function (html, next) {
                    const container = document.createElement('div');
                    container.innerHTML = html;
                    const createWrapper = (block, svgUrl, pngUrl) => {
                        const wrapper = element('div.graphviz-wrapper');
                        wrapper.dataset({ src: svgUrl, png: pngUrl });
                        wrapper.html(element('div').style({ textAlign: 'center', padding: '20px', color: '#666' }).text('Cargando diagrama...').html(undefined, true));
                        block.parentNode.replaceChild(wrapper.resume(), block);
                    };
                    container.querySelectorAll('pre[data-lang="dot"]').forEach(block => {
                        const svgUrl = `https://quickchart.io/graphviz?format=svg&graph=${encodeURIComponent(block.textContent)}`;
                        createWrapper(block, svgUrl, svgUrl);
                    });
                    next(container.innerHTML);
                });
                hook.doneEach(function () {
                    /** Configurar Zoom Compartido */
                    const setupZoom = (containerTarget, svgTarget) => {
                        const [container, svg] = element([containerTarget, svgTarget]);
                        if (!container || !svg || container.selectOne('.zoom-overlay')) return;
                        /** Estilos Globales */
                        insertStyle({ id: 'zoom-overlay-styles', css: buildStyle($ => ({ '.zoom-overlay': { position: $.absolute, top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'zoom-in', zIndex: 10 } })) });
                        /** Configuración de Contenedor y SVG */
                        container.style($ => ({ position: $.relative, display: $.inlineBlock, width: $.percent(100) })).dataset({ zoomAttached: true });
                        svg.style($ => ({ maxWidth: $.percent(100), height: $.auto }));
                        /** Overlay y Lógica de Zoom */
                        if (window.mediumZoom) {
                            const imgBuilder = element('img.zoom-overlay');
                            container.appendChild(imgBuilder);
                            const img = imgBuilder.resume();
                            const zoom = window.mediumZoom(img, { background: '#0f172a' });
                            imgBuilder.onclick((e) => {
                                if (e.pointerType === 'touch') return;
                                const currentSvg = container.selectOne('svg');
                                if (currentSvg) {
                                    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currentSvg.outerHTML)}`;
                                    if (img.src !== dataUri) img.src = dataUri;
                                }
                                imgBuilder.style({ opacity: '1' });
                                zoom.open();
                                setTimeout(() => { try { element('.fluid-loupe', false).style({ backgroundImage: `url("${img.src}")` }); } catch (e) { } }, 350);
                            });
                            zoom.on('closed', () => imgBuilder.style({ opacity: '0' }));
                        }
                    };
                    /** Lógica Graphviz */
                    document.querySelectorAll('.graphviz-wrapper').forEach(rawDiv => {
                        const div = element(rawDiv);
                        if (div.getDataset('loaded')) return;
                        const url = div.getDataset('src');
                        if (url) {
                            fetch(url).then(res => res.text()).then(svgContent => {
                                div.innerHTML = svgContent;
                                div.dataset('loaded', true);
                                const svgEl = div.selectOne('svg');
                                svgEl && setupZoom(div, svgEl);
                            }).catch(err => {
                                div.innerHTML = element('div').style({ color: 'red' }).text('Error cargando diagrama').html();
                                console.error(err);
                            });
                        }
                    });
                    /** Lógica Mermaid Zoom */
                    const processMermaidZoom = () => {
                        document.querySelectorAll('.mermaid').forEach(div => {
                            const svg = div.querySelector('svg');
                            const overlay = div.querySelector('.zoom-overlay');
                            if (svg && !overlay) setupZoom(div, svg);
                        });
                    };
                    processMermaidZoom();
                    setTimeout(processMermaidZoom, 500);
                    setTimeout(processMermaidZoom, 1500);
                });

            }
        ]
    };
})();
