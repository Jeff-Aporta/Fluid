// @ts-nocheck
(function moduloConfigDocHelpers() {
    /** 1. IMPORTS */
    const { element, insertStyle, buildStyle, snippetsHTML } = /** @type {any} */ (window).FluidUI;
    const { HELPERS } = /** @type {any} */ (window).FluidUI || {}; // Ensure accessible if needed

    /** 2. VARIABLES DEL MODULO (LOUPE) */
    /** @type {number} */
    let LOUPE_WIDTH = 250;
    /** @type {number} */
    let LOUPE_HEIGHT = 250;
    let ZOOM_LEVEL = 2;
    /** @type {HTMLElement|any} */
    let loupe;
    /** @type {HTMLElement|any} */
    let loupeGhost;
    /** @type {MouseEvent|null} */
    let lastMouseEvent = null;
    let isHorizontal = false;
    /** @type {MutationObserver|null} */
    let activeObserver = null;
    /** @type {string|null} */
    let currentObjectUrl = null;
    /** @type {any} */
    let inactivityTimeout;

    /** 3. HELPERS */
    const clamp = ({ valor, min, max }) => Math.max(min, Math.min(max, valor));
    const setLoupeState = (styles) => {
        loupe?.style?.(styles);
        loupeGhost?.style?.(styles);
    };
    function normalize(t) { return t.trim().toLowerCase().replace(/\s/g, ''); }

    /** 4. FUNCIONES LOUPE */
    function updateLoupe() {
        const PERCENTAGE = isHorizontal ? 0.35 : 0.25;
        (isHorizontal) ? (LOUPE_HEIGHT = window.innerHeight * PERCENTAGE, LOUPE_WIDTH = Math.min(LOUPE_HEIGHT * (16 / 9), window.innerWidth * 0.9)) : (LOUPE_WIDTH = window.innerWidth * PERCENTAGE, LOUPE_HEIGHT = Math.min(LOUPE_WIDTH * (16 / 9), window.innerHeight * 0.9));
        loupe = element('div.fluid-loupe', true);
        loupeGhost = element('div.fluid-loupe-ghost', true);
        if (!document.body.contains(loupe.resume())) document.body.appendChild(loupe.resume());
        if (!document.body.contains(loupeGhost.resume())) document.body.appendChild(loupeGhost.resume());
        insertStyle({
            id: 'fluid-loupe-dims',
            css: buildStyle($ => ({
                ".fluid-loupe, .fluid-loupe-ghost": { width: LOUPE_WIDTH, height: LOUPE_HEIGHT }
            }))
        });
    }

    function onKeyUp(e) {
        if (e.key === 'Control') { isHorizontal = !isHorizontal; updateLoupe(); lastMouseEvent && onMouseMove(lastMouseEvent); }
    }

    function onWheel(e) {
        const activeImage = document.querySelector('.medium-zoom-image--opened');
        if (!activeImage) return;
        e.preventDefault(); e.stopPropagation();
        const delta = Math.sign(e.deltaY) * -0.1;
        ZOOM_LEVEL = clamp({ valor: ZOOM_LEVEL + delta, min: 1, max: 5 });
        updateLoupe(); lastMouseEvent && onMouseMove(lastMouseEvent);
    }

    function onMouseMove(e) {
        lastMouseEvent = e;
        resetInactivityTimer();
        const activeImage = document.querySelector('.medium-zoom-image--opened');
        if (!activeImage) { setLoupeState({ display: 'none' }); return; }
        updateLoupe();
        const rect = activeImage.getBoundingClientRect(), x = e.clientX, y = e.clientY;
        setLoupeState({ display: 'block' });
        const ghostWidth = LOUPE_WIDTH / ZOOM_LEVEL, ghostHeight = LOUPE_HEIGHT / ZOOM_LEVEL;
        const ghostHalfW = ghostWidth / 2, ghostHalfH = ghostHeight / 2;
        let lrLeft, lrTop;
        (isHorizontal) ? (lrLeft = (window.innerWidth - LOUPE_WIDTH) / 2, lrTop = window.innerHeight - LOUPE_HEIGHT) : (lrLeft = window.innerWidth - LOUPE_WIDTH, lrTop = (window.innerHeight - LOUPE_HEIGHT) / 2);
        const gRight = x + ghostHalfW, gBottom = y + ghostHalfH, gLeft = x - ghostHalfW, gTop = y - ghostHalfH;
        const colision = (gRight > lrLeft && gLeft < (lrLeft + LOUPE_WIDTH)) && (gBottom > lrTop && gTop < (lrTop + LOUPE_HEIGHT));
        const PCT = isHorizontal ? 0.4 : 0.33;
        const transformStr = (/** @type {any} */ $) => isHorizontal
            ? { top: colision ? '0' : $.percent((1 - PCT) * 100), left: '50%', transform: $.transform().translateX("-50%").str() }
            : { left: colision ? '0' : $.percent((1 - PCT) * 100), top: '50%', transform: $.transform().translateY("-50%").str() };

        if (isHorizontal) loupe.style(transformStr); else loupe.style(transformStr);

        loupeGhost.style($ => ({
            top: $.px(clamp({ valor: y, min: rect.top + ghostHalfH, max: rect.bottom - ghostHalfH })),
            left: $.px(clamp({ valor: x, min: rect.left + ghostHalfW, max: rect.right - ghostHalfW })),
            transform: $.transform().translateX("-50%").translateY("-50%").scale(1 / ZOOM_LEVEL).str()
        }));

        const relX = x - rect.left, relY = y - rect.top, mbg = 10;
        const bgX = clamp({ valor: (relX * ZOOM_LEVEL) - (LOUPE_WIDTH / 2), min: -mbg, max: (rect.width - ghostWidth + mbg) * ZOOM_LEVEL });
        const bgY = clamp({ valor: (relY * ZOOM_LEVEL) - (LOUPE_HEIGHT / 2), min: -mbg, max: (rect.height - ghostHeight + mbg) * ZOOM_LEVEL });
        loupe.style({ backgroundSize: `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`, backgroundPosition: `${-bgX}px ${-bgY}px` });
    }

    function hideLoupe() {
        setLoupeState({ display: 'none' });
        document.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('wheel', onWheel);
        document.removeEventListener('keyup', onKeyUp);
        activeObserver?.disconnect(); activeObserver = null;
        if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
    }

    function setupLoupe(target) {
        isHorizontal = false; updateLoupe(); ZOOM_LEVEL = 2;
        if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
        let bgUrl = "";
        if (target.tagName === 'IMG') bgUrl = /** @type {HTMLImageElement} */ (target).src;
        else if (target.tagName === 'svg' || target.tagName === 'SVG') {
            const blob = new Blob([new XMLSerializer().serializeToString(target)], { type: "image/svg+xml;charset=utf-8" });
            currentObjectUrl = URL.createObjectURL(blob); bgUrl = currentObjectUrl;
        }
        loupe.style({ backgroundImage: `url("${bgUrl}")` });
        document.addEventListener('mousemove', onMouseMove, true);
        document.addEventListener('wheel', onWheel, { passive: false });
        document.addEventListener('keyup', onKeyUp);
        setLoupeState({ display: 'none' });
    }

    function resetInactivityTimer() {
        if (ZOOM_LEVEL < 1.2) { setLoupeState({ opacity: 0 }); return; }
        setLoupeState({ opacity: 1 }); clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => setLoupeState({ opacity: 0 }), 6000);
    }

    /** 5. DOC PROCESSORS */
    const hoistEndMarkers = (n) => {
        if (!n || n.nodeType !== 1) return false;
        let extracted = false;
        while (n.lastChild) {
            const last = n.lastChild;
            if (last.nodeType === 3) {
                if (!last.textContent.trim()) { n.removeChild(last); continue; }
                else break;
            } else if (last.nodeType === 8) {
                const t = normalize(last.textContent);
                if (t.endsWith(':end') || t.startsWith('/')) {
                    n.parentNode.insertBefore(last, n.nextSibling);
                    extracted = true;
                } else break;
            } else if (last.nodeType === 1) {
                if (hoistEndMarkers(last)) extracted = true;
                else break;
            } else break;
        }
        return extracted;
    };

    function processTabs(parent) {
        let node = parent.firstChild, depth = 0, nodes = [], startNode = null;
        while (node) {
            const next = node.nextSibling;
            if (node.nodeType === 8) {
                const text = node.textContent.trim();
                if (text === 'tabs:start') {
                    depth++;
                    if (depth === 1) { startNode = node; nodes = []; }
                    else nodes.push(node);
                } else if (text === 'tabs:end') {
                    if (depth > 0) {
                        depth--;
                        if (depth === 0) {
                            const headerNodes = [];
                            const contentNodes = [];
                            let curContent = null, subDepth = 0;
                            nodes.forEach(n => {
                                const isComment = n.nodeType === 8;
                                const text = isComment ? n.textContent.trim() : '';
                                if (isComment && text === 'tabs:start') subDepth++;
                                else if (isComment && text === 'tabs:end') subDepth--;
                                const isTabTrigger = subDepth === 0 && (
                                    /^H[1-6]$/.test(n.nodeName) || (isComment && text.startsWith('tab:') && !text.startsWith('tabs:'))
                                );
                                if (isTabTrigger) {
                                    const title = isComment ? text.substring(4).trim() : n.textContent;
                                    const id = 'tab-' + Math.random().toString(36).substr(2, 9);
                                    const isFirst = headerNodes.length === 0;

                                    headerNodes.push(element(snippetsHTML.tabButton({
                                        active: isFirst,
                                        title: title,
                                        id: id
                                    })));

                                    curContent = element(snippetsHTML.tabPanel({
                                        active: isFirst,
                                        id: id
                                    }));
                                    contentNodes.push(curContent);
                                } else if (curContent) curContent.appendChild(n.cloneNode(true));
                            });

                            const tabs = element(snippetsHTML.tabs({ header: headerNodes, content: contentNodes }));

                            // Post-creation active state check (unchanged logic adapted to nodes)
                            if (headerNodes.length > 0 && !headerNodes.some(n => n.resume().classList.contains('active'))) {
                                // Logic handled in creation loop for first item, but explicit check here if needed:
                                // Actually, loop sets isFirst, so we are good.
                            }
                            parent.insertBefore(tabs.resume(), startNode);
                            [startNode, ...nodes, node].forEach(n => parent.removeChild(n));
                            tabs.selectAll('.fluid-tab-panel').forEach(panelBuilder => {
                                const panel = panelBuilder.resume();
                                processTabs(panel); processColumns(panel); processCards(panel); processDetails(panel);
                            });
                        } else nodes.push(node);
                    } else nodes.push(node);
                } else if (depth > 0) nodes.push(node);
            } else if (depth > 0) nodes.push(node);
            node = next;
        }
    }

    function processColumns(parent) {
        let node = parent.firstChild, depth = 0, nodes = [], startNode = null;
        let currentRowConfig = null;
        const defaults = { minWidth: '390px', wrap: true, gap: '10px' };

        const renderRow = (rowNodes, sNode, eNode) => {
            const config = { ...defaults, ...currentRowConfig };
            // Collect columns
            const rowChildren = [];
            let currentChildren = [];

            // Helper to close a column and add it to row 
            const closeColumn = () => {
                rowChildren.push(element({ 'div.fluid-col': { style: { flex: `1 1 ${config.minWidth}`, padding: '0' }, children: currentChildren } }));
                currentChildren = [];
            };

            rowNodes.forEach(n => {
                const t = n.nodeType === 8 ? normalize(n.textContent) : '';
                if (t === 'col' || t === 'column') {
                    closeColumn(); // Push previous column
                } else {
                    currentChildren.push(n.cloneNode(true));
                }
            });
            closeColumn(); // Push last column

            const rowContainer = element(snippetsHTML.row({
                style: { gap: config.gap, flexWrap: config.wrap ? 'wrap' : 'nowrap', alignItems: 'center' },
                children: rowChildren
            }));

            if (sNode && sNode.parentNode) {
                parent.insertBefore(rowContainer.resume(), sNode);
                const toRemove = [sNode, ...rowNodes];
                if (eNode) toRemove.push(eNode);
                toRemove.forEach(n => n.parentNode && parent.removeChild(n));
            }
            rowContainer.selectAll('.fluid-col').forEach(col => {
                const c = col.resume();
                try { processTabs(c); processColumns(c); processCards(c); processDetails(c); } catch (e) { }
            });
        };

        while (node) {
            if (node.nodeType === 1 && (node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'P')) {
                hoistEndMarkers(node);
            }
            const next = node.nextSibling;
            let clean = '';
            if (node.nodeType === 8) { clean = normalize(node.textContent); }
            else if (node.tagName === 'P') {
                const c = Array.from(node.childNodes).find(child => child.nodeType === 8);
                if (c) clean = normalize(c.textContent);
            }
            if (clean) {
                const isEnd = clean === 'row:end' || clean === '/row' || clean === 'endrow' || clean.endsWith('row:end');
                const isStart = !isEnd && (clean === 'row' || clean.startsWith('row:'));
                if (isStart) {
                    depth++;
                    if (depth === 1) {
                        startNode = node; nodes = [];
                        try {
                            let rawText = node.textContent.trim();
                            if (node.tagName === 'P') { const c = Array.from(node.childNodes).find(child => child.nodeType === 8); if (c) rawText = c.textContent.trim(); }
                            const jsonStr = rawText.includes('row:') ? rawText.substring(rawText.indexOf('row:') + 4).trim() : '';
                            let jsonContent = '';
                            if (clean.startsWith('row:')) { const colonIdx = rawText.indexOf(':'); if (colonIdx !== -1) jsonContent = rawText.substring(colonIdx + 1).trim(); }
                            currentRowConfig = jsonContent ? JSON.parse(jsonContent.startsWith(':') ? jsonContent.substring(1) : jsonContent) : {};
                        } catch (e) { currentRowConfig = {}; }
                    } else nodes.push(node);
                } else if (isEnd) {
                    if (depth > 0) {
                        depth--;
                        if (depth === 0) { renderRow(nodes, startNode, node); nodes = []; startNode = null; } else nodes.push(node);
                    } else nodes.push(node);
                } else if (depth > 0) nodes.push(node);
            } else if (depth > 0) nodes.push(node);
            node = next;
        }
        if (depth > 0 && startNode) { console.warn('FluidDocs: Auto-closing unclosed row'); renderRow(nodes, startNode, null); }
    }

    function processCards(parent) {
        let node = parent.firstChild, depth = 0, nodes = [], startNode = null, cardConfig = {};

        const renderCard = (cardNodes, sNode, eNode) => {
            const children = [];
            cardNodes.forEach(n => {
                const t = n.nodeType === 8 ? normalize(n.textContent) : '';
                if (!t.startsWith('card:')) {
                    children.push(n.cloneNode(true));
                }
            });

            // Prepare props for snippet
            const cardProps = { children: children };
            if (cardConfig.title) cardProps.title = element(cardConfig.title);
            if (cardConfig.footer) cardProps.footer = element(cardConfig.footer);

            const card = element(snippetsHTML.card(cardProps));

            if (sNode && sNode.parentNode) {
                parent.insertBefore(card.resume(), sNode);
                const toRemove = [sNode, ...cardNodes];
                if (eNode) toRemove.push(eNode);
                toRemove.forEach(n => n.parentNode && parent.removeChild(n));
            }

            const cEl = card.resume();
            try { processTabs(cEl); processColumns(cEl); processCards(cEl); processDetails(cEl); } catch (e) { }
        };

        while (node) {
            if (node.nodeType === 1 && (node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'P')) hoistEndMarkers(node);
            const next = node.nextSibling;
            let clean = '';
            let rawText = '';

            if (node.nodeType === 8) { rawText = node.textContent.trim(); clean = normalize(rawText); }
            else if (node.tagName === 'P') { const c = Array.from(node.childNodes).find(child => child.nodeType === 8); if (c) { rawText = c.textContent.trim(); clean = normalize(rawText); } }

            if (clean) {
                const isEnd = clean === 'card:end' || clean === '/card' || clean === 'endcard' || clean.endsWith('card:end');
                const isStart = !isEnd && (clean === 'card:start' || clean.startsWith('card:start:'));

                if (isStart) {
                    depth++;
                    if (depth === 1) {
                        startNode = node;
                        nodes = [];
                        cardConfig = {};
                        // Parse JSON config
                        const jsonMatch = rawText.match(/^card:start:(.+)$/);
                        if (jsonMatch) {
                            try { cardConfig = JSON.parse(jsonMatch[1]); } catch (e) { console.error('FluidDocs: Invalid Card JSON', e); }
                        }
                    } else nodes.push(node);
                } else if (isEnd) {
                    if (depth > 0) {
                        depth--;
                        if (depth === 0) { renderCard(nodes, startNode, node); nodes = []; startNode = null; } else nodes.push(node);
                    } else nodes.push(node);
                } else if (depth > 0) nodes.push(node);
            } else if (depth > 0) nodes.push(node);
            node = next;
        }
        if (depth > 0 && startNode) { console.warn('FluidDocs: Auto-closing unclosed card'); renderCard(nodes, startNode, null); }
    }

    function processDetails(parent) {
        let node = parent.firstChild, depth = 0, nodes = [], startNode = null, variant = 'primary';
        const renderDetails = (dNodes, sNode, eNode) => {
            const renderDetails = (dNodes, sNode, eNode) => {
                const variantClass = variant === 'secondary' ? 'secondary' : '';
                let currentSection = 'content';
                const parts = { summary: document.createDocumentFragment(), content: document.createDocumentFragment() };

                dNodes.forEach(n => {
                    const t = n.nodeType === 8 ? normalize(n.textContent) : '';
                    if (t === 'details:summary' || t === 'summary') currentSection = 'summary';
                    else if (t === 'details:content') currentSection = 'content';
                    else {
                        if (currentSection === 'summary' && n.tagName === 'P') { while (n.firstChild) parts[currentSection].appendChild(n.firstChild); }
                        else parts[currentSection].appendChild(n.cloneNode(true));
                    }
                });

                // Recursively process content BEFORE creating the snippet, because snippet expects array of nodes/builders
                // Actually, we can pass fragments or arrays. Snippets expect arrays for 'children'.

                // We need to process inner directives. 
                // In the original, we processed fragments `parts.content` and `parts.summary`.
                [parts.content, parts.summary].forEach(frag => { try { processTabs(frag); processColumns(frag); processCards(frag); processDetails(frag); } catch (e) { } });

                // Convert fragments to arrays for the snippet
                const summaryChildren = Array.from(parts.summary.childNodes);
                const contentChildren = Array.from(parts.content.childNodes);

                const details = element(snippetsHTML.detail({
                    class: `group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden mb-4 m-[10px] ${variantClass}`.trim(),
                    title: summaryChildren, // snippet handles array
                    content: contentChildren
                }));

                if (sNode && sNode.parentNode) {
                    parent.insertBefore(details.resume(), sNode);
                    const toRemove = [sNode, ...dNodes];
                    if (eNode) toRemove.push(eNode);
                    toRemove.forEach(n => n.parentNode && parent.removeChild(n));
                }
            };
        };
        while (node) {
            const next = node.nextSibling;
            let clean = '';
            if (node.nodeType === 8) clean = normalize(node.textContent);
            else if (node.tagName === 'P') { const c = Array.from(node.childNodes).find(child => child.nodeType === 8); if (c) clean = normalize(c.textContent); }
            if (clean) {
                const isEnd = clean === 'details:end' || clean.endsWith('details:end');
                const isStart = !isEnd && (clean === 'details:start' || clean === 'details:start:secondary');
                if (isStart) {
                    depth++;
                    if (depth === 1) { startNode = node; nodes = []; variant = clean.includes(':secondary') ? 'secondary' : 'primary'; } else nodes.push(node);
                } else if (isEnd) {
                    if (depth > 0) { depth--; if (depth === 0) { renderDetails(nodes, startNode, node); nodes = []; startNode = null; } else nodes.push(node); } else nodes.push(node);
                } else if (depth > 0) nodes.push(node);
            } else if (depth > 0) nodes.push(node);
            node = next;
        }
        if (depth > 0 && startNode) renderDetails(nodes, startNode, null);
    }

    function processChips(parent) {
        let node = parent.firstChild;
        while (node) {
            const next = node.nextSibling;
            if (node.nodeType === 8) {
                const text = node.textContent.trim();
                if (text.startsWith('chip:')) {
                    const parts = text.substring(5);
                    let isSecondary = false, chipText = parts;
                    if (parts.startsWith('secondary:')) { isSecondary = true; chipText = parts.substring(10); }
                    if (chipText) {
                        const chip = element('span');
                        const borderColor = isSecondary ? 'border-purple-500' : 'border-cyan-500';
                        const textColor = isSecondary ? 'text-purple-400' : 'text-cyan-400';
                        chip.resume().className = `inline-block px-3 py-1 text-xs font-bold tracking-wider ${textColor} uppercase bg-slate-900 border ${borderColor} rounded shadow-sm`;
                        chip.text(chipText);
                        parent.insertBefore(chip.resume(), node);
                        parent.removeChild(node);
                    }
                }
            }
            node = next;
        }
    }

    function processFooter(parent) {
        let node = parent.firstChild;
        while (node) {
            const next = node.nextSibling;
            let clean = '';
            let rawText = '';
            let targetNode = node;

            if (node.nodeType === 8) {
                rawText = node.textContent.trim();
                clean = normalize(rawText);
            } else if (node.tagName === 'P') {
                const c = Array.from(node.childNodes).find(child => child.nodeType === 8);
                if (c) {
                    rawText = c.textContent.trim();
                    clean = normalize(rawText);
                    targetNode = node; // Replace the P tag if it wraps the comment
                }
            }

            if (clean.startsWith('footer:')) {
                try {
                    const jsonStr = rawText.substring(rawText.indexOf(':') + 1).trim();
                    const config = JSON.parse(jsonStr);

                    const footer = element({ footer: { class: 'app-footer', children: [{ span: { class: 'creator-info', content: config.autor || '' } }, { div: { class: 'social-links', children: (config.buttons || []).map(btn => ({ a: { href: btn.url, target: '_blank', class: 'social-btn', title: btn.title, children: [{ i: { class: btn.icon || '' } }] } })) } }] } });

                    // Replace the marker with the generated footer
                    parent.insertBefore(footer.resume(), targetNode);
                    parent.removeChild(targetNode);
                } catch (e) {
                    console.error('FluidDocs: Error Parsing Footer JSON', e);
                }
            }
            node = next;
        }
    }

    /** EXPORT GLOBALS */
    window.FluidDocHelpers = {
        setupLoupe, hideLoupe, updateLoupe,
        processTabs, processColumns, processCards, processDetails, processChips, processFooter,
        hoistEndMarkers, normalize, setLoupeState
    };
})();