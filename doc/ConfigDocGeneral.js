// @ts-nocheck
window.ConfigDocGeneral = {
    search: {
        maxAge: 86400000,
        paths: 'auto',
        placeholder: 'Buscar...',
        noData: 'No se encontraron resultados',
        depth: 6
    },
    zoom: {
        selector: 'img:not(.emoji)',
        background: '#0f172a',
        scrollOffset: 0
    },
    mermaid: {
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: { defaultRenderer: 'elk' }
    },
    topMargin: 90,
    progress: {
        position: "top",
        color: "var(--theme-color, #00FFCC)",
        height: "3px",
    },
    plugins: [
        function (hook, vm) {
            // 2. Custom Scroll Spy for Sidebar
            hook.doneEach(function () {
                const sidebar = document.querySelector('.sidebar');
                if (!sidebar) return;

                let headerWrapper = sidebar.querySelector('.sidebar-header');
                if (!headerWrapper) {
                    headerWrapper = document.createElement('div');
                    headerWrapper.className = 'sidebar-header';
                    sidebar.prepend(headerWrapper);
                }

                const title = sidebar.querySelector(':not(.sidebar-header) > h1');
                const appNav = sidebar.querySelector(':not(.sidebar-header) > .app-nav');
                const search = sidebar.querySelector(':not(.sidebar-header) > .search');

                if (title) headerWrapper.appendChild(title);
                if (appNav) headerWrapper.appendChild(appNav);
                if (search) headerWrapper.appendChild(search);

                if (sidebar.firstChild !== headerWrapper) {
                    sidebar.prepend(headerWrapper);
                }
            });

            // 2. Custom Scroll Spy (Active Link Highlighter)
            hook.doneEach(function () {
                const main = document.querySelector('.markdown-section');
                const sidebar = document.querySelector('.sidebar');

                if (!main || !sidebar) return;

                let lastActiveId = '';

                const updateActiveLink = () => {
                    const headers = main.querySelectorAll('h1, h2, h3, h4, h5, h6');
                    let currentId = '';
                    let minDiff = Infinity;

                    headers.forEach(header => {
                        const rect = header.getBoundingClientRect();
                        const diff = Math.abs(rect.top - 100);

                        if (diff < minDiff) {
                            minDiff = diff;
                            currentId = header.getAttribute('id');
                        }
                    });

                    if (currentId && currentId !== lastActiveId) {
                        lastActiveId = currentId;

                        const allLinks = sidebar.querySelectorAll('li.active, a.active');
                        allLinks.forEach(el => el.classList.remove('active'));

                        const allSidebarLinks = Array.from(sidebar.querySelectorAll('a[href*="id="]'));
                        const activeLink = allSidebarLinks.find(link => {
                            const href = link.getAttribute('href');
                            // Extract ID from href (e.g., "?id=section-id" or "file.md?id=section-id")
                            const idMatch = href.match(/[?&]id=([^&]+)/);
                            if (idMatch && idMatch[1]) {
                                return decodeURIComponent(idMatch[1]) === decodeURIComponent(currentId);
                            }
                            return false;
                        });

                        if (activeLink) {
                            activeLink.classList.add('active');

                            const sidebarRect = sidebar.getBoundingClientRect();
                            const linkRect = activeLink.getBoundingClientRect();
                            const header = sidebar.querySelector('.sidebar-header');
                            const headerOffset = header ? header.offsetHeight : 0;
                            const bottomOffset = 20;

                            const isOutOfView = linkRect.top < (sidebarRect.top + headerOffset) || linkRect.bottom > (sidebarRect.bottom - bottomOffset);

                            if (isOutOfView) {
                                const visibleCenter = (sidebar.clientHeight - headerOffset) / 2 + headerOffset;
                                const scrollAmount = (linkRect.top - sidebarRect.top) - visibleCenter + (linkRect.height / 2);
                                sidebar.scrollTop += scrollAmount;
                            }

                            const parentLi = activeLink.closest('li');
                            if (parentLi) parentLi.classList.add('active');
                        }
                    }
                };

                window.addEventListener('scroll', updateActiveLink);
                setTimeout(updateActiveLink, 100);
            });

            // 3. CodeMirror Integration
            hook.doneEach(function () {
                const codeBlocks = document.querySelectorAll('pre[data-lang]');
                codeBlocks.forEach((block) => {
                    if (block.nextElementSibling && block.nextElementSibling.classList.contains('CodeMirror')) return;

                    const code = block.querySelector('code');
                    if (!code) return;

                    const lang = block.getAttribute('data-lang');
                    const content = code.textContent;

                    const modeMap = {
                        'js': 'javascript', 'javascript': 'javascript', 'json': 'json',
                        'ts': 'javascript', 'typescript': 'javascript', 'html': 'htmlmixed',
                        'css': 'css', 'xml': 'xml', 'sql': 'sql', 'markdown': 'markdown',
                        'md': 'markdown', 'yaml': 'yaml', 'yml': 'yaml',
                        'csharp': 'clike', 'cs': 'clike', 'java': 'clike', 'cpp': 'clike'
                    };

                    const mode = modeMap[lang] || 'text/plain';
                    const editorContainer = document.createElement('div');
                    block.parentNode.insertBefore(editorContainer, block);
                    block.style.display = 'none';

                    CodeMirror(editorContainer, {
                        value: content,
                        mode: mode,
                        theme: 'vscode-dark',
                        lineNumbers: true,
                        readOnly: true,
                        lineWrapping: true
                    });
                });
            });

            // 4. Graphviz & Mermaid Rendering Plugin
            hook.afterEach(function (html, next) {
                const container = document.createElement('div');
                container.innerHTML = html;

                // Helper to replace block with wrapper
                function createWrapper(block, svgUrl, pngUrl) {
                    const wrapper = document.createElement('div');
                    wrapper.className = "graphviz-wrapper";
                    wrapper.dataset.src = svgUrl;
                    wrapper.dataset.png = pngUrl;
                    wrapper.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">Cargando diagrama...</div>';
                    block.parentNode.replaceChild(wrapper, block);
                }

                // Process DOT blocks
                container.querySelectorAll('pre[data-lang="dot"]').forEach(block => {
                    const code = block.textContent;
                    const svgUrl = `https://quickchart.io/graphviz?format=svg&graph=${encodeURIComponent(code)}`;
                    const pngUrl = svgUrl;
                    createWrapper(block, svgUrl, pngUrl);
                });

                // Process Mermaid blocks - REMOVED to use docsify-mermaid plugin locally
                // container.querySelectorAll('pre[data-lang="mermaid"]').forEach(block => { ... });

                next(container.innerHTML);
            });

            hook.doneEach(function () {
                // Shared Zoom Setup Function
                const setupZoom = (container, svg) => {
                    // Check if overlay already exists to prevent duplicates
                    if (!container || !svg || container.querySelector('.zoom-overlay')) return;
                    
                    container.dataset.zoomAttached = "true";
                    container.style.position = 'relative';
                    container.style.display = 'inline-block';
                    container.style.width = '100%';

                    svg.style.maxWidth = '100%';
                    svg.style.height = 'auto';

                    if (window.mediumZoom) {
                        const img = document.createElement('img');
                        img.classList.add('zoom-overlay');
                        
                        // Overlay styles
                        Object.assign(img.style, {
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            opacity: '0',
                            cursor: 'zoom-in',
                            zIndex: '10'
                        });

                        container.appendChild(img);

                        // Initial zoom instance
                        const zoom = window.mediumZoom(img, { background: '#0f172a' });

                        img.addEventListener('click', (e) => {
                            e.stopPropagation();
                            
                            // Refresh Image Source from CURRENT SVG
                            const currentSvg = container.querySelector('svg');
                            if (currentSvg) {
                                const svgCode = currentSvg.outerHTML;
                                const encodedSvg = encodeURIComponent(svgCode);
                                const dataUri = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
                                
                                // Only update if changed
                                if (img.src !== dataUri) {
                                    img.src = dataUri;
                                }
                            }

                            // Open zoom
                            img.style.opacity = '1';
                            zoom.open();
                        });

                        zoom.on('closed', () => {
                            img.style.opacity = '0';
                        });
                    }
                };

                // Graphviz Logic
                const graphs = document.querySelectorAll('.graphviz-wrapper');
                graphs.forEach(div => {
                    if (div.dataset.loaded) return;
                    const url = div.dataset.src;

                    if (url) {
                        fetch(url)
                            .then(res => res.text())
                            .then(svgContent => {
                                div.innerHTML = svgContent;
                                div.dataset.loaded = "true";
                                const svgEl = div.querySelector('svg');
                                if (svgEl) {
                                    setupZoom(div, svgEl);
                                }
                            })
                            .catch(err => {
                                div.innerHTML = '<div style="color:red">Error cargando diagrama</div>';
                                console.error(err);
                            });
                    }
                });

                // Mermaid Zoom Logic (Async handling)
                const processMermaidZoom = () => {
                    const mermaidDivs = document.querySelectorAll('.mermaid');
                    mermaidDivs.forEach(div => {
                        const svg = div.querySelector('svg');
                        const overlay = div.querySelector('.zoom-overlay');
                        // If SVG exists but no overlay (or overlay was wiped), setup zoom
                        if (svg && !overlay) {
                            setupZoom(div, svg);
                        }
                    });
                };

                // Attempt immediately and retry for async rendering
                processMermaidZoom();
                setTimeout(processMermaidZoom, 500);
                setTimeout(processMermaidZoom, 1500);
            });
        }
    ]
};
