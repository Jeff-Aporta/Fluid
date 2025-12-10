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

    /** Cierre de diálogos al dar click en backdrop */
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIALOG' && e.target.classList.contains('fluid-dialog')) {
            e.target.close();
        }
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
                    });

                    /** Scroll Spy Logic */
                    const [main, sidebarEl] = element(['.markdown-section', '.sidebar'], false);
                    if (!main || !sidebarEl) return;

                    let lastActiveId = '';
                    const startTime = Date.now();

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
                            /** Limpiar activos previos */
                            sidebarEl.selectAll('li.active, a.active').forEach(el => el.removeClass('active'));
                            /** Buscar link activo */
                            const activeLink = sidebarEl.selectAll('a').find(link => {
                                const href = link.attr('href');
                                const idMatch = href && href.match(regexId);
                                return idMatch && idMatch[1] && ([currentId, lastActiveId].some(id => decodeURIComponent(idMatch[1]) === decodeURIComponent(id)));
                            });

                    

                            if (activeLink) {
                                activeLink.addClass('active');
                                lastActiveId = currentId;

                                /** Activar todos los padres LI para mantener árbol abierto */
                                let parent = activeLink.resume().parentElement;
                                const sidebarNode = sidebarEl.resume();
                                while (parent && parent !== sidebarNode) {
                                    if (parent.tagName === 'LI') parent.classList.add('active');
                                    parent = parent.parentElement;
                                }

                                /** Actualizar URL (Hash Strategy compatible con Docsify) */
                                if ((Date.now() - startTime > 1000)) {
                                    const newHash = `/?id=${currentId}`;
                                    if (window.location.hash !== `#${newHash}`) {
                                        history.replaceState(null, '', `#${newHash}`);
                                    }
                                }



                                /** Scroll Sidebar (Estrategia Block Center - Sidebar Only) */
                                const sidebarRaw = sidebarEl.resume();
                                const linkRaw = activeLink.resume();
                                // --- Scroll Centering Logic (Fixed) ---
                                
                                if (sidebarRaw && linkRaw) {
                                    const sidebarRect = sidebarRaw.getBoundingClientRect();
                                    const linkRect = linkRaw.getBoundingClientRect();
                                    const linkCenter = linkRect.top;
                                    const offset = linkCenter - sidebarRect.height / 2;
                                    sidebarRaw.scrollBy({ top: offset, behavior: 'smooth' });
                                }
                            }
                        }
                    };
                    window.addEventListener('scroll', updateActiveLink);
                    setTimeout(updateActiveLink, 100);
                });

                /** 2. CodeMirror Integration */
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

                /** 3. Custom Tabs & Diagram Rendering Plugin */
                hook.afterEach(function (html, next) {
                    const container = document.createElement('div');
                    container.innerHTML = html;

                    /** A. Process Custom Tabs (<!-- tabs:start -->) */
                    const iterateNodes = (parent) => {
                        let currentNode = parent.firstChild;
                        let inTabBlock = false;
                        let tabBlockNodes = [];
                        let startCommentNode = null;

                        while (currentNode) {
                            const nextNode = currentNode.nextSibling;
                            if (currentNode.nodeType === 8 && currentNode.textContent.trim() === 'tabs:start') {
                                inTabBlock = true; tabBlockNodes = []; startCommentNode = currentNode;
                            } else if (currentNode.nodeType === 8 && currentNode.textContent.trim() === 'tabs:end') {
                                if (inTabBlock && startCommentNode) {
                                    const tabsContainer = document.createElement('div'); tabsContainer.className = 'fluid-tabs';
                                    const headerContainer = document.createElement('div'); headerContainer.className = 'fluid-tabs-header';
                                    const contentContainer = document.createElement('div'); contentContainer.className = 'fluid-tabs-content';
                                    let currentTabContent = null; let firstTab = true;

                                    tabBlockNodes.forEach(node => {
                                        if (node.tagName && /^H[1-6]$/.test(node.tagName)) {
                                            const title = node.textContent; const tabId = 'tab-' + Math.random().toString(36).substr(2, 9);
                                            const btn = document.createElement('button'); btn.className = 'fluid-tab-btn' + (firstTab ? ' active' : '');
                                            btn.textContent = title; btn.setAttribute('data-tab-target', tabId); headerContainer.appendChild(btn);

                                            currentTabContent = document.createElement('div');
                                            // FORCE DISPLAY BLOCK FOR ACTIVE TAB INLINE STYLE TO OVERRIDE ANY CSS ISSUES
                                            currentTabContent.className = 'fluid-tab-panel' + (firstTab ? ' active' : '');
                                            if (firstTab) currentTabContent.style.display = 'block';
                                            currentTabContent.setAttribute('data-tab-content', tabId); contentContainer.appendChild(currentTabContent);
                                            firstTab = false;
                                        } else {
                                            if (currentTabContent) currentTabContent.appendChild(node.cloneNode(true));
                                        }
                                    });
                                    tabsContainer.appendChild(headerContainer); tabsContainer.appendChild(contentContainer);
                                    parent.insertBefore(tabsContainer, startCommentNode);
                                    parent.removeChild(startCommentNode); tabBlockNodes.forEach(n => parent.removeChild(n)); parent.removeChild(currentNode);
                                    inTabBlock = false;
                                }
                            } else if (inTabBlock) { tabBlockNodes.push(currentNode); }
                            currentNode = nextNode;
                        }
                    };
                    iterateNodes(container);

                    /** B. Process Graphviz with View Code */
                    const createWrapper = (block, svgUrl, pngUrl) => {
                        const wrapper = element('div.graphviz-wrapper').style({ position: 'relative' }); // Ensure relative positioning
                        wrapper.dataset({ src: svgUrl, png: pngUrl });

                        // Create Canvas for Diagram
                        const canvas = element('div.graphviz-canvas').style({ textAlign: 'center', padding: '20px', color: '#666' }).text('Cargando diagrama...');
                        wrapper.appendChild(canvas);

                        // Generate Unique ID for Dialog
                        const dialogId = 'dialog-gv-' + Math.random().toString(36).substr(2, 9);

                        // Create Dialog
                        const dialog = element(`dialog#${dialogId}.fluid-dialog`);
                        const header = element('div.fluid-dialog-header');
                        header.appendChild(element('h3').text('Código Fuente'));
                        header.appendChild(element('button').text('✕').attr({ command: 'close', commandfor: dialogId }));

                        const content = element('div.fluid-dialog-content');
                        const pre = element('pre');
                        const code = element('code').text(block.textContent); // Embed content directly
                        pre.appendChild(code);
                        content.appendChild(pre);

                        dialog.appendChild(header);
                        dialog.appendChild(content);
                        wrapper.appendChild(dialog); // Append to wrapper

                        // Add View Code Button (Invoker)
                        const btn = element('button.view-code-btn').text('Ver Código').attr({
                            command: 'show-modal',
                            commandfor: dialogId
                        }).style({ position: 'absolute', top: '10px', right: '10px', padding: '5px 10px', fontSize: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 100, opacity: 0.7, transition: 'opacity 0.3s' });

                        btn.resume().onmouseenter = () => btn.style({ opacity: 1 });
                        btn.resume().onmouseleave = () => btn.style({ opacity: 0.7 });

                        wrapper.appendChild(btn);

                        block.parentNode.replaceChild(wrapper.resume(), block);
                    };
                    container.querySelectorAll('pre[data-lang="dot"]').forEach(block => {
                        const svgUrl = `https://quickchart.io/graphviz?format=svg&graph=${encodeURIComponent(block.textContent)}`;
                        createWrapper(block, svgUrl, svgUrl);
                    });

                    /** C. Process Mermaid with View Code */
                    container.querySelectorAll('pre[data-lang="mermaid"]').forEach(block => {
                        const wrapper = document.createElement('div');
                        wrapper.style.position = 'relative';
                        wrapper.className = 'mermaid-wrapper';

                        const div = document.createElement('div');
                        div.classList.add('mermaid');
                        const rawContent = (block.querySelector('code') || block).textContent.trim();
                        div.textContent = rawContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

                        wrapper.appendChild(div);

                        // Generate Unique ID for Dialog
                        const dialogId = 'dialog-mm-' + Math.random().toString(36).substr(2, 9);

                        // Create Dialog
                        const dialog = document.createElement('dialog');
                        dialog.id = dialogId;
                        dialog.className = 'fluid-dialog';
                        dialog.innerHTML = `
                            <div class="fluid-dialog-header">
                                <h3>Código Fuente</h3>
                                <button command="close" commandfor="${dialogId}">✕</button>
                            </div>
                            <div class="fluid-dialog-content">
                                <pre><code>${(block.querySelector('code') || block).textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                            </div>
                        `;
                        wrapper.appendChild(dialog);

                        // Add View Code Button (Invoker)
                        const btn = document.createElement('button');
                        btn.textContent = 'Ver Código';
                        btn.className = 'view-code-btn';
                        btn.setAttribute('command', 'show-modal');
                        btn.setAttribute('commandfor', dialogId);
                        btn.style.cssText = 'position:absolute;top:10px;right:10px;padding:5px 10px;font-size:12px;background:rgba(0,0,0,0.5);color:white;border:none;border-radius:4px;cursor:pointer;z-index:100;opacity:0.7;transition:opacity 0.3s;';

                        btn.onmouseenter = () => btn.style.opacity = '1';
                        btn.onmouseleave = () => btn.style.opacity = '0.7';

                        wrapper.appendChild(btn);

                        block.parentNode.replaceChild(wrapper, block);
                    });

                    next(container.innerHTML);
                });

                /** 5. Tab Interactivity & Diagram Zoom */
                hook.doneEach(function () {
                    /** A. Tab Click Handlers */
                    document.querySelectorAll('.fluid-tab-btn').forEach(btn => {
                        btn.onclick = (e) => {
                            const targetBtn = e.target;
                            const parent = targetBtn.closest('.fluid-tabs');
                            if (!parent) return;

                            const tabId = targetBtn.getAttribute('data-tab-target');

                            // Deactivate all
                            parent.querySelectorAll('.fluid-tab-btn').forEach(b => b.classList.remove('active'));
                            parent.querySelectorAll('.fluid-tab-panel').forEach(p => {
                                p.classList.remove('active');
                                p.style.display = 'none';
                            });

                            // Activate clicked
                            targetBtn.classList.add('active');
                            const targetPanel = parent.querySelector(`[data-tab-content="${tabId}"]`);
                            if (targetPanel) {
                                targetPanel.classList.add('active');
                                targetPanel.style.display = 'block';
                            }
                        };
                    });

                    /** B. Configurar Zoom Compartido */
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
                            /** Calcular margen para simular 90vw/90vh (5% margen = 24px min) -> El usuario quiere imagen grande */
                            const margin = Math.min(window.innerWidth, window.innerHeight) * 0.05;
                            const zoom = window.mediumZoom(img, { background: '#0f172a', margin: margin });
                            img._zoom = zoom;
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

                    /** C. Lógica Graphviz */
                    document.querySelectorAll('.graphviz-wrapper').forEach(rawDiv => {
                        const div = element(rawDiv);
                        if (div.getDataset('loaded')) return;
                        const url = div.getDataset('src');
                        if (url) {
                            fetch(url).then(res => res.text()).then(svgContent => {
                                const canvas = div.resume().querySelector('.graphviz-canvas');
                                if (canvas) {
                                    canvas.innerHTML = svgContent;
                                    div.dataset('loaded', true);
                                    const svgEl = canvas.querySelector('svg');
                                    svgEl && setupZoom(div, svgEl);
                                }
                            }).catch(err => {
                                const canvas = div.resume().querySelector('.graphviz-canvas');
                                if (canvas) canvas.innerHTML = '<div style="color: red">Error cargando diagrama</div>';
                                console.error(err);
                            });
                        }
                    });

                    /** D. Lógica Mermaid Rendering & Zoom */
                    const processMermaid = async () => {
                        const nodes = document.querySelectorAll('.mermaid');
                        if (nodes.length === 0) return;

                        /** 1. Renderizar si mermaid está disponible */
                        if (window.mermaid) {
                            // Filtrar nodos que aún no son SVG (texto crudo)
                            const rawNodes = Array.from(nodes).filter(n => !n.querySelector('svg'));
                            if (rawNodes.length > 0) {
                                try {
                                    // Temporarily reveal hidden tabs for rendering
                                    const hiddenTabs = [];
                                    rawNodes.forEach(node => {
                                        const tab = node.closest('.fluid-tab-panel');
                                        if (tab && getComputedStyle(tab).display === 'none') {
                                            tab.style.display = 'block';
                                            tab.style.visibility = 'hidden';
                                            tab.style.position = 'absolute'; // avoid layout shift
                                            hiddenTabs.push(tab);
                                        }
                                    });

                                    await window.mermaid.run({ nodes: rawNodes });

                                    // Restore hidden state
                                    hiddenTabs.forEach(tab => {
                                        tab.style.display = 'none';
                                        tab.style.visibility = '';
                                        tab.style.position = '';
                                    });
                                } catch (err) {
                                    console.error('Mermaid rendering error:', err);
                                    rawNodes.forEach(rn => rn.style.color = 'red');
                                }
                            }
                        }

                        /** 2. Configurar Zoom (después del renderizado) */
                        nodes.forEach(div => {
                            const svg = div.querySelector('svg');
                            const overlay = div.querySelector('.zoom-overlay');
                            if (svg && !overlay) setupZoom(div, svg);
                        });
                    };

                    processMermaid();
                    // Retries para esperar carga diferida del módulo mermaid
                    setTimeout(processMermaid, 500);
                    setTimeout(processMermaid, 1500);
                    setTimeout(processMermaid, 3000);
                });
            }
        ]
    };
})();

/* Efecto de lupa en las imágenes cuando se abre con zoom image ---*/

(() => {
    const { element, insertStyle } = window.FluidUI
    /** @type {number} */ let LOUPE_WIDTH; /** @type {number} */ let LOUPE_HEIGHT; let ZOOM_LEVEL = 2;
    const clamp = (valor, min, max) => Math.max(min, Math.min(max, valor)); /** retorna valor limitado */
    /** @type {any} */ let loupe; /** @type {any} */ let loupeGhost; let lastMouseEvent = null, isHorizontal = false, activeObserver = null, currentObjectUrl = null, inactivityTimeout;

    /** 2. Configuración y Eventos */
    document.addEventListener('click', (e) => {
        if (e.pointerType === 'touch') return
        const target = e.target
        /** Detectar cierre: click en imagen abierta, overlay o fallback si la lupa bloquea */
        const openedImg = document.querySelector('.medium-zoom-image.medium-zoom-image--opened')
        const isLoupe = target.classList.contains('fluid-loupe') || target.classList.contains('fluid-loupe-ghost')

        if (openedImg && (openedImg.contains(target) || isLoupe || target.classList.contains('medium-zoom-overlay'))) {
            if (openedImg._zoom) openedImg._zoom.close()
            else openedImg.click()
            hideLoupe()
            return
        }

        const isImg = target.tagName === 'IMG' && target.classList.contains('medium-zoom-image')
        const isMermaid = target.closest('.mermaid') && (target.tagName === 'svg' || target.closest('svg'))
        if (isImg || isMermaid) setTimeout(() => setupLoupe(isMermaid ? (target.tagName === 'svg' ? target : target.closest('svg')) : target), 300)
    })

    /** Cierre con tecla Escape */
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            const openedImg = document.querySelector('.medium-zoom-image--opened')
            if (openedImg) {
                if (openedImg._zoom) openedImg._zoom.close()
                else openedImg.click()
                hideLoupe()
            }
        }
    })

    const setLoupeState = (styles) => { /** Helper para estado compartido */
        if (loupe && loupe.style) loupe.style(styles)
        if (loupeGhost && loupeGhost.style) loupeGhost.style(styles)
    }

    /** 3. Funciones Principales */
    function update() {
        const PERCENTAGE = isHorizontal ? 0.35 : 0.25
        if (isHorizontal) { LOUPE_HEIGHT = window.innerHeight * PERCENTAGE; LOUPE_WIDTH = Math.min(LOUPE_HEIGHT * (16 / 9), window.innerWidth * 0.9) }
        else { LOUPE_WIDTH = window.innerWidth * PERCENTAGE; LOUPE_HEIGHT = Math.min(LOUPE_WIDTH * (16 / 9), window.innerHeight * 0.9) }

        loupe = element('div.fluid-loupe', true); loupeGhost = element('div.fluid-loupe-ghost', true)
        !document.body.contains(loupe.resume()) && document.body.appendChild(loupe.resume())
        !document.body.contains(loupeGhost.resume()) && document.body.appendChild(loupeGhost.resume())

        /** Actualizar dimensiones dinámicas directamente en el elemento */
        loupe.style({ width: LOUPE_WIDTH, height: LOUPE_HEIGHT })
        loupeGhost.style({ width: LOUPE_WIDTH, height: LOUPE_HEIGHT })
    }

    function onKeyUp(e) {
        if (e.key === 'Control') { isHorizontal = !isHorizontal; update(); lastMouseEvent && onMouseMove(lastMouseEvent) }
    }

    function setupLoupe(target) {
        isHorizontal = false; update(); ZOOM_LEVEL = 2;
        if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null }
        let bgUrl = ""

        if (target.tagName === 'IMG') bgUrl = target.src
        else if (target.tagName === 'svg' || target.tagName === 'SVG') {
            const svgData = new XMLSerializer().serializeToString(target), blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
            currentObjectUrl = URL.createObjectURL(blob); bgUrl = currentObjectUrl
        }
        loupe.style({ backgroundImage: `url("${bgUrl}")` })
        document.addEventListener('mousemove', onMouseMove, true); document.addEventListener('wheel', onWheel, { passive: false }); document.addEventListener('keyup', onKeyUp)
        setLoupeState({ display: 'none' })
    }

    function hideLoupe() {
        setLoupeState({ display: 'none' })
        document.removeEventListener('mousemove', onMouseMove, true); document.removeEventListener('wheel', onWheel); document.removeEventListener('keyup', onKeyUp)
        if (activeObserver) { activeObserver.disconnect(); activeObserver = null }
        if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null }
    }

    function resetInactivityTimer() {
        if (ZOOM_LEVEL < 1.2) { setLoupeState({ opacity: 0 }); return }
        setLoupeState({ opacity: 1 }); clearTimeout(inactivityTimeout)
        inactivityTimeout = setTimeout(() => setLoupeState({ opacity: 0 }), 6000)
    }

    function onWheel(e) {
        const activeImage = document.querySelector('.medium-zoom-image--opened'); if (!activeImage) return
        e.preventDefault(); e.stopPropagation()
        const delta = Math.sign(e.deltaY) * -0.1
        ZOOM_LEVEL = clamp(ZOOM_LEVEL + delta, 1, 5)
        update(); lastMouseEvent && onMouseMove(lastMouseEvent)
    }

    function onMouseMove(e) {
        lastMouseEvent = e; resetInactivityTimer()
        const activeImage = document.querySelector('.medium-zoom-image--opened'); if (!activeImage) { setLoupeState({ display: 'none' }); return }
        update()
        const rect = activeImage.getBoundingClientRect(), x = e.clientX, y = e.clientY
        setLoupeState({ display: 'block' })

        const ghostWidth = LOUPE_WIDTH / ZOOM_LEVEL, ghostHeight = LOUPE_HEIGHT / ZOOM_LEVEL
        const ghostHalfW = ghostWidth / 2, ghostHalfH = ghostHeight / 2

        /** Calculate Loupe Position (Default) */
        let lrLeft, lrTop
        if (isHorizontal) { lrLeft = (window.innerWidth - LOUPE_WIDTH) / 2; lrTop = window.innerHeight - LOUPE_HEIGHT }
        else { lrLeft = window.innerWidth - LOUPE_WIDTH; lrTop = (window.innerHeight - LOUPE_HEIGHT) / 2 }

        const gRight = x + ghostHalfW, gBottom = y + ghostHalfH, gLeft = x - ghostHalfW, gTop = y - ghostHalfH;
        const colisionEspectro = (gRight > lrLeft && gLeft < (lrLeft + LOUPE_WIDTH)) && (gBottom > lrTop && gTop < (lrTop + LOUPE_HEIGHT));

        const PERCENTAGE = isHorizontal ? 0.4 : 0.33;

        if (isHorizontal) loupe.style($ => ({ top: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100), left: '50%', transform: $.transform().translateX("-50%").str() }))
        else loupe.style($ => ({ left: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100), top: '50%', transform: $.transform().translateY("-50%").str() }))

        loupeGhost.style($ => ({ top: $.px(clamp(y, rect.top + ghostHalfH, rect.bottom - ghostHalfH)), left: $.px(clamp(x, rect.left + ghostHalfW, rect.right - ghostHalfW)) }))

        const relX = x - rect.left, relY = y - rect.top, mbg = 10
        const bgX = clamp((relX * ZOOM_LEVEL) - (LOUPE_WIDTH / 2), -mbg, (rect.width - ghostWidth + mbg) * ZOOM_LEVEL)
        const bgY = clamp((relY * ZOOM_LEVEL) - (LOUPE_HEIGHT / 2), -mbg, (rect.height - ghostHeight + mbg) * ZOOM_LEVEL)
        loupe.style({ backgroundSize: `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`, backgroundPosition: `${-bgX}px ${-bgY}px` })
    }
})()
