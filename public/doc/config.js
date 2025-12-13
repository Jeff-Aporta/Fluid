// @ts-nocheck
(function moduloConfigDocGeneral() {
    /* 1. IMPORTS */
    const { element, insertStyle, buildStyle, snippetsHTML } = window.FluidUI
    /* const Helpers = window.FluidDocHelpers (Moved to dynamic access) */

    /* 4. VARIABLES DEL MODULO */
    const CM_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2'
    const CM_MODE = `${CM_BASE}/mode`
    const DOCSIFY_BASE = 'https://cdn.jsdelivr.net/npm'
    const DOCSIFY_PKG = `${DOCSIFY_BASE}/docsify`
    const REACT_BASE = 'https://unpkg.com'
    const regexId = /[?&]id=([^&#]+)/
    const modes = { js: 'javascript', javascript: 'javascript', json: 'application/json', ts: 'application/typescript', typescript: 'application/typescript', tsx: 'text/typescript-jsx', jsx: 'text/jsx', html: 'htmlmixed', css: 'css', xml: 'xml', sql: 'sql', markdown: 'markdown', md: 'markdown', yaml: 'yaml', yml: 'yaml', csharp: 'clike', cs: 'clike', java: 'clike', cpp: 'clike' }

    /* 5. ARROW FUNCTIONS */
    /* procesa bloques de alerta */
    const processAlerts = (container) => {
        container.querySelectorAll('blockquote').forEach(bq => {
            const p = bq.querySelector('p')
            if (!p) return;
            const fullText = p.textContent.trim()
            const match = fullText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i)
            if (!match) return;
            const type = match[1].toLowerCase()
            let htmlContent = p.innerHTML.trim()
            const markerRegex = new RegExp(`^\\[!${match[1]}\\]`, 'i')
            htmlContent = htmlContent.replace(markerRegex, '').trim()
            let title = type.toUpperCase(), content = ''
            const splitRegex = /(<br\s*\/?>|\n)/i
            const splitMatch = htmlContent.match(splitRegex)
            if (splitMatch) {
                const index = splitMatch.index
                const head = htmlContent.substring(0, index).trim()
                const tail = htmlContent.substring(index + splitMatch[0].length).trim()
                head.length > 0 ? (title = head, content = tail) : (content = tail)
            } else if (htmlContent.length > 0) title = htmlContent, content = ''
            bq.parentNode.replaceChild(element(snippetsHTML.api.alert({ type, title, content })).resume(), bq)
        })
    }

    /* procesa comentarios estructurales */
    const processCommentBlocks = (container) => {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_COMMENT, null, false)
        const comments = []
        let currentNode = walker.nextNode()
        while (currentNode) comments.push(currentNode), currentNode = walker.nextNode()
        for (let i = 0; i < comments.length; i++) {
            const startNode = comments[i]
            if (!startNode.parentNode) continue;
            const text = startNode.textContent.trim()
            /* ALERT */
            if (text.startsWith('alert:')) {
                let meta = { type: 'note' }
                try {
                    const jsonStr = text.replace('alert:', '').trim()
                    if (jsonStr.startsWith('{')) meta = JSON.parse(jsonStr)
                } catch (e) { }
                let contentNodes = [], endNode = null, nextNode = startNode.nextSibling
                while (nextNode) {
                    if (nextNode.nodeType === 8 && nextNode.textContent.trim() === 'alert:end') { endNode = nextNode; break }
                    contentNodes.push(nextNode), nextNode = nextNode.nextSibling
                }
                if (endNode) {
                    /* verifica separador de cuerpo */
                    let titleNodes = [], bodyNodes = [], hasBodySeparator = false
                    for (let node of contentNodes) {
                        if (node.nodeType === 8 && node.textContent.trim() === 'alert:body') { hasBodySeparator = true; continue }
                        hasBodySeparator ? bodyNodes.push(node) : titleNodes.push(node)
                    }
                    let titleHTML = '', contentHTML = ''
                    if (hasBodySeparator) {
                        /* renderiza titulo */
                        const titleDiv = document.createElement('div')
                        titleNodes.forEach(n => titleDiv.appendChild(n.cloneNode(true)))
                        titleHTML = titleDiv.innerHTML.trim().replace(/^<p>(.*?)<\/p>$/is, '$1').trim()
                        /* renderiza cuerpo */
                        const bodyDiv = document.createElement('div')
                        bodyNodes.forEach(n => bodyDiv.appendChild(n))
                        contentHTML = bodyDiv.innerHTML
                    } else {
                        titleHTML = meta.title
                        const contentDiv = document.createElement('div')
                        contentNodes.forEach(n => contentDiv.appendChild(n))
                        contentHTML = contentDiv.innerHTML
                    }
                    const finalTitle = titleHTML || meta.title
                    const alertEl = element(snippetsHTML.api.alert({ type: meta.type, title: finalTitle, content: contentHTML }))
                    startNode.parentNode.replaceChild(alertEl.resume(), startNode)
                    endNode.parentNode.removeChild(endNode)
                }
            }
            /* DETAILS */
            if (text.startsWith('details:start')) {
                const parts = text.split(':'), modifiers = parts.slice(2)
                let contentNodes = [], endNode = null, nextNode = startNode.nextSibling
                while (nextNode) {
                    if (nextNode.nodeType === 8 && nextNode.textContent.trim() === 'details:end') { endNode = nextNode; break }
                    contentNodes.push(nextNode), nextNode = nextNode.nextSibling
                }
                if (endNode) {
                    const tempDiv = document.createElement('div')
                    contentNodes.forEach(n => tempDiv.appendChild(n))
                    let summaryHTML = 'Details', bodyHTML = '', sectionSummary = [], sectionBody = [], currentSection = 'body'
                    Array.from(tempDiv.childNodes).forEach(node => {
                        if (node.nodeType === 8) {
                            const t = node.textContent.trim()
                            if (t === 'details:summary') currentSection = 'summary'
                            else if (t === 'details:content') currentSection = 'body'
                        } else currentSection === 'summary' ? sectionSummary.push(node) : sectionBody.push(node)
                    })
                    if (sectionSummary.length) {
                        const d = document.createElement('div')
                        sectionSummary.forEach(n => d.appendChild(n.cloneNode(true)))
                        summaryHTML = d.innerHTML
                    }
                    const dBody = document.createElement('div')
                    sectionBody.forEach(n => dBody.appendChild(n.cloneNode(true)))
                    bodyHTML = dBody.innerHTML
                    /* map modifiers */
                    const extraClasses = modifiers.join(' '), isOpen = modifiers.includes('open')
                    const detailEl = element(snippetsHTML.detail({ title: summaryHTML, content: [{ div: { content: bodyHTML } }], class: extraClasses, open: isOpen }))
                    startNode.parentNode.replaceChild(detailEl.resume(), startNode)
                    endNode.parentNode.removeChild(endNode)
                }
            }
        }
    }

    /* procesa bloques externos (graficos) */
    const processExternalBlock = (container, selector, wrapperClass, renderFn, title, btnLabel) => {
        container.querySelectorAll(selector).forEach(block => {
            try {
                const raw = block.textContent.trim()
                const id = 'dialog-' + Math.random().toString(36).substr(2, 9)
                const contentDef = renderFn(raw)
                const { dialog, button } = snippetsHTML.api.codeModal({ id, title, code: raw, btnLabel })
                const wrapper = element({ div: { class: wrapperClass, style: { position: 'relative' }, children: [contentDef, { dialog }, { 'button.view-code-btn': button }] } })
                block.parentNode.replaceChild(wrapper.resume(), block)
            } catch (e) { console.error(`FluidDocs: Error procesando ${selector}`, e) }
        })
    }

    /* configura zoom compartido */
    const setupZoom = (containerTarget, svgTarget) => {
        const [container, svg] = element([containerTarget, svgTarget])
        if (!container || !svg || container.selectOne('.zoom-overlay')) return;
        insertStyle({ id: 'zoom-overlay-styles', css: buildStyle($ => ({ '.zoom-overlay': { position: $.absolute, top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'zoom-in', zIndex: 10 } })) })
        container.style($ => ({ position: $.relative, display: $.inlineBlock, width: $.percent(100) })).dataset({ zoomAttached: true })
        svg.style($ => ({ maxWidth: $.percent(100), height: $.auto }))
        if (window.mediumZoom) {
            const img = element('img.zoom-overlay'); container.appendChild(img)
            const zoom = window.mediumZoom(img.resume(), { background: '#0f172a', margin: Math.min(window.innerWidth, window.innerHeight) * 0.05 })
            img.resume()._zoom = zoom
            img.onclick((e) => {
                if (e.pointerType === 'touch') return;
                const current = container.selectOne('svg')
                if (current) { const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(current.outerHTML)}`; if (img.resume().src !== uri) img.resume().src = uri }
                img.style({ opacity: '1' }), zoom.open()
                setTimeout(() => { (window.FluidDocHelpers && window.FluidDocHelpers.setupLoupe) ? window.FluidDocHelpers.setupLoupe(img.resume()) : null }, 350)
            })
            zoom.on('closed', () => {
                img.style({ opacity: '0' })
                if (window.FluidDocHelpers && window.FluidDocHelpers.hideLoupe) window.FluidDocHelpers.hideLoupe()
            })
        }
    }

    /* procesa mermaid */
    const processMermaid = async () => {
        const nodes = document.querySelectorAll('.mermaid')
        const raw = Array.from(nodes).filter(n => !n.querySelector('svg'))
        if (!raw.length || !window.mermaid) return;
        if (window.mermaid.mermaidAPI) window.mermaid.mermaidAPI.initialize({ theme: 'dark', startOnLoad: false })
        const ghost = document.createElement('div')
        ghost.style.cssText = 'position:absolute;top:-9999px;left:0;width:1024px;opacity:0;z-index:-1;visibility:visible;display:block;'
        document.body.appendChild(ghost)
        for (const node of raw) {
            const placeholder = document.createComment('mermaid-placeholder')
            try {
                node.parentNode.replaceChild(placeholder, node)
                ghost.appendChild(node)
                await window.mermaid.run({ nodes: [node] })
            } catch (e) {
                console.error('FluidDocs: Mermaid render error', e), node.style.color = 'red', node.textContent = 'Render Error: ' + (e.message || e)
            } finally { placeholder.parentNode ? placeholder.parentNode.replaceChild(node, placeholder) : null }
        }
        document.body.removeChild(ghost)
        nodes.forEach(d => { const svg = d.querySelector('svg'); if (svg && !d.querySelector('.zoom-overlay')) setupZoom(d, svg) })
    }

    /* actualiza enlace activo en sidebar */
    const updateActiveLink = (main, sidebarEl) => {
        const headers = main.selectAll('h1, h2, h3, h4, h5, h6')
        if (!headers.length) return;

        let activeId = ''
        // Find the last header that is above the threshold (120px)
        for (const header of headers) {
            const node = header.resume ? header.resume() : header
            if (node.getBoundingClientRect().top < 120) {
                activeId = node.id
            } else {
                break
            }
        }

        if (activeId) {
            const sidebarLinks = sidebarEl.selectAll('a')
            const normalize = (id) => decodeURIComponent(id).replace(/^_/, '')

            const activeLink = sidebarLinks.find(link => {
                const href = link.attr('href') || ''
                const match = href.match(regexId)
                return match && match[1] && normalize(match[1]) === normalize(activeId)
            })

            if (activeLink) {
                const previousActive = sidebarEl.selectOne('.active')
                if (previousActive) sidebarEl.selectAll('.active').forEach(el => el.removeClass('active'))

                activeLink.addClass('active')
                const linkNode = activeLink.resume ? activeLink.resume() : activeLink
                const sidebarNode = sidebarEl.resume ? sidebarEl.resume() : sidebarEl

                let parent = linkNode.parentElement
                while (parent && parent !== sidebarNode) {
                    if (parent.tagName === 'LI') parent.classList.add('active');
                    parent = parent.parentElement
                }

                const newHash = `/?id=${activeId}`
                if (window.location.hash !== `#${newHash}`) history.replaceState(null, '', `#${newHash}`)

                const sidebarRect = sidebarNode.getBoundingClientRect()
                const linkRect = linkNode.getBoundingClientRect()
                const isInView = (linkRect.top >= sidebarRect.top + 40) && (linkRect.bottom <= sidebarRect.bottom - 40)

                if (!isInView) {
                    let top = 0, el = linkNode
                    while (el && el !== sidebarNode) { top += el.offsetTop; el = el.offsetParent }
                    const targetTop = top - (sidebarNode.clientHeight / 2) + (linkNode.offsetHeight / 2)
                    sidebarNode.scrollTo({ top: targetTop, behavior: 'smooth' })
                }
            }
        }
    }

    /* 7. EXPORTS */

    /* 7. CONFIGURACION GENERAL */
    const ConfigDocGeneral = {
        /* Buscador */
        search: { maxAge: 86400000, paths: 'auto', placeholder: 'Buscar...', noData: 'No se encontraron resultados', depth: 6 },
        /* Zoom */
        zoom: { selector: 'img:not(.emoji):not(.no-loupe)', background: '#0f172a', scrollOffset: 0 },
        /* Mermaid */
        mermaid: { theme: 'dark', securityLevel: 'loose', flowchart: { defaultRenderer: 'elk' } },
        /* Estilos generales */
        topMargin: 90,
        progress: buildStyle($ => ({ position: $.top, color: $.cssVar("theme-color", "#00FFCC"), height: $.px(3) })),
        /* Dependencias */
        dependencies: () => {
            const deps = [
                { link: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css' } },
                { script: { src: `${REACT_BASE}/react@18/umd/react.development.js` } }, { script: { src: `${REACT_BASE}/react-dom@18/umd/react-dom.development.js` } }, { script: { src: `${REACT_BASE}/@babel/standalone/babel.min.js` } },
                { script: { src: `${CM_BASE}/codemirror.min.js` } }, { script: { src: `${CM_MODE}/javascript/javascript.min.js` } }, { script: { src: `${CM_MODE}/jsx/jsx.min.js` } }, { script: { src: `${CM_MODE}/sql/sql.min.js` } }, { script: { src: `${CM_MODE}/json/json.min.js` } }, { script: { src: `${CM_MODE}/xml/xml.min.js` } }, { script: { src: `${CM_MODE}/css/css.min.js` } }, { script: { src: `${CM_MODE}/htmlmixed/htmlmixed.min.js` } }, { script: { src: `${CM_MODE}/markdown/markdown.min.js` } }, { script: { src: `${CM_MODE}/yaml/yaml.min.js` } }, { script: { src: `${CM_MODE}/clike/clike.min.js` } }, { script: { src: `${CM_MODE}/meta.min.js` } },
                { script: { src: 'https://cdn.tailwindcss.com' } },
                { script: { src: `${DOCSIFY_PKG}@4`, defer: true } }, { script: { src: `${DOCSIFY_PKG}/lib/plugins/search.min.js`, defer: true } }, { script: { src: `${DOCSIFY_BASE}/mermaid@10/dist/mermaid.min.js` } }, { script: { src: `${DOCSIFY_BASE}/medium-zoom@1.1.0/dist/medium-zoom.min.js`, defer: true } }, { script: { src: `${DOCSIFY_PKG}/lib/plugins/zoom-image.min.js`, defer: true } }, { script: { src: `${DOCSIFY_PKG}/lib/plugins/copy-code.min.js`, defer: true } }, { script: { src: `${DOCSIFY_BASE}/docsify-progress@latest/dist/progress.min.js`, defer: true } }
            ]
            document.write(deps.map(el => element(el).html()).join(''))
        },
        plugins: [
            function (hook) {
                /* 1. Custom Sidebar Header & Scroll Spy */
                hook.doneEach(function () {
                    const sidebar = element('.sidebar', false)
                    if (!sidebar) return;
                    let headerWrapper = sidebar.selectOne('.sidebar-header')
                    if (!headerWrapper) headerWrapper = element('div.sidebar-header', true), sidebar.prepend(headerWrapper);
                    const title = sidebar.selectOne(':not(.sidebar-header) > h1')
                    const appNav = sidebar.selectOne(':not(.sidebar-header) > .app-nav')
                    const search = sidebar.selectOne(':not(.sidebar-header) > .search')
                    if (title || appNav || search) headerWrapper.appendChild(title, appNav, search)
                    if (sidebar.firstChild !== headerWrapper.resume()) sidebar.prepend(headerWrapper)
                    element('.app-name-link', false)?.onclick(e => { e.preventDefault(), window.scrollTo(0, 0), history.replaceState(null, '', '#') })
                    /* Scroll Spy Logic */
                    const [main, sidebarEl] = element(['.markdown-section', '.sidebar'], false)
                    if (main && sidebarEl) {
                        let scrollTimeout
                        window.addEventListener('scroll', () => { if (scrollTimeout) clearTimeout(scrollTimeout); scrollTimeout = setTimeout(() => updateActiveLink(main, sidebarEl), 1) })
                        setTimeout(() => updateActiveLink(main, sidebarEl), 300)
                    }
                })
                /* 2. CodeMirror Integration */
                hook.doneEach(function () {
                    document.querySelectorAll('pre[data-lang]').forEach(block => {
                        if (block.getAttribute('data-lang') === 'latex') return;
                        if (block.nextElementSibling?.classList.contains('CodeMirror')) return;
                        const code = block.querySelector('code')
                        if (!code) return;
                        const editor = document.createElement('div')
                        block.parentNode.insertBefore(editor, block), block.style.display = 'none'
                        const cm = CodeMirror(editor, { value: code.textContent, mode: modes[block.getAttribute('data-lang')] || 'text/plain', theme: 'vscode-dark', lineNumbers: true, readOnly: true, lineWrapping: false })
                        setTimeout(() => { editor.querySelector('.CodeMirror').CodeMirror = cm }, 0)
                    })
                })
                /* 3. Custom Tabs & Diagram Rendering */
                hook.afterEach(function (html, next) {
                    const container = document.createElement('div'); container.innerHTML = html
                    /* Process Details Marker */
                    container.querySelectorAll('.fluid-details-marker').forEach(marker => {
                        const detailEl = element(snippetsHTML.detail({ title: marker.getAttribute('data-title'), content: [{ div: { content: marker.innerHTML } }] }))
                        marker.parentNode.replaceChild(detailEl.resume(), marker)
                    })
                    /* Normalize: Unwrap structural comments from P tags */
                    container.querySelectorAll('p').forEach(p => {
                        const hasStructural = Array.from(p.childNodes).some(c => c.nodeType === 8 && /^(row|col|card:|tab:|details:|chip:|summary|content|footer:)/.test(c.textContent.trim()))
                        if (hasStructural) { while (p.firstChild) p.parentNode.insertBefore(p.firstChild, p); p.parentNode.removeChild(p) }
                    })
                    /* EXECUTE PROCESSORS (Helpers) */
                    try { processAlerts(container) } catch (e) { console.error('FluidDocs: Alert Error', e) }
                    try { processCommentBlocks(container) } catch (e) { console.error('FluidDocs: Comment Block Error', e) }
                    /* const Helpers = window.FluidDocHelpers */;
                    if (window.FluidDocHelpers) {
                        try { window.FluidDocHelpers.processTabs(container) } catch (e) { console.error('FluidDocs: Tab Processing Error', e) }
                        try { window.FluidDocHelpers.processColumns(container) } catch (e) { console.error('FluidDocs: Column Processing Error', e) }
                        try { window.FluidDocHelpers.processCards(container) } catch (e) { console.error('FluidDocs: Card Processing Error', e) }
                        try { window.FluidDocHelpers.processChips(container) } catch (e) { console.error('FluidDocs: Chip Processing Error', e) }
                        try { window.FluidDocHelpers.processFooter(container) } catch (e) { console.error('FluidDocs: Footer Processing Error', e) }
                    }
                    /* Process External Blocks */
                    processExternalBlock(container, 'pre[data-lang="dot"]', 'graphviz-wrapper', code => snippetsHTML.api.image({ type: 'graphviz', code }), 'Codigo Fuente', { i: { class: 'fa-solid fa-code' } })
                    processExternalBlock(container, 'pre[data-lang="chart"]', 'chart-wrapper', code => snippetsHTML.api.image({ type: 'chart', code, alt: 'Chart' }), 'Configuracion JSON', { i: { class: 'fa-solid fa-code' } })
                    processExternalBlock(container, 'pre[data-lang="latex"]', 'latex-wrapper', code => snippetsHTML.api.image({ type: 'latex', code }), 'Codigo LaTeX', { i: { class: 'fa-solid fa-code' } })
                    /* Process Mermaid */
                    container.querySelectorAll('pre[data-lang="mermaid"]').forEach(block => {
                        try {
                            const wrapper = document.createElement('div'); wrapper.className = 'mermaid-wrapper'; wrapper.style.position = 'relative'
                            const mermaidDiv = document.createElement('div'); mermaidDiv.className = 'mermaid'
                            const code = (block.querySelector('code') || block).textContent
                            mermaidDiv.textContent = code.trim().replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
                            wrapper.appendChild(mermaidDiv)
                            const id = 'dialog-mm-' + Math.random().toString(36).substr(2, 9)
                            const { dialog, button } = snippetsHTML.api.codeModal({ id, title: 'Codigo Fuente', code: code, btnLabel: { i: { class: 'fa-solid fa-code' } } })
                            wrapper.appendChild(element({ dialog }).resume())
                            wrapper.appendChild(element({ 'button.view-code-btn': button }).resume())
                            if (block.parentNode) block.parentNode.replaceChild(wrapper, block)
                        } catch (e) { console.error('FluidDocs: Mermaid Processing Error', e) }
                    })
                    next(container.innerHTML)
                })
                /* 4. Sidebar Details & Chips Processing */
                hook.doneEach(function () {
                    const sidebarNav = document.querySelector('.sidebar-nav')
                    if (sidebarNav && !sidebarNav.dataset.detailsProcessed && window.FluidDocHelpers) {
                        try { window.FluidDocHelpers.processDetails(sidebarNav) } catch (e) { console.error('FluidDocs: Sidebar Details Error', e) }
                        try { window.FluidDocHelpers.processChips(sidebarNav) } catch (e) { console.error('FluidDocs: Sidebar Chips Error', e) }
                        sidebarNav.dataset.detailsProcessed = 'true'
                    }
                })
                /* 5. Tab Interactivity & Diagram Zoom */
                hook.doneEach(function () {
                    /* Tab Click Handlers */
                    document.querySelectorAll('.fluid-tab-btn').forEach(btn => {
                        btn.onclick = (e) => {
                            const target = e.target, parent = target.closest('.fluid-tabs')
                            if (!parent) return;
                            const header = parent.querySelector('.fluid-tabs-header'), content = parent.querySelector('.fluid-tabs-content')
                            if (header) Array.from(header.children).forEach(b => { if (b.classList.contains('fluid-tab-btn')) b.classList.remove('active') })
                            if (content) Array.from(content.children).forEach(p => { if (p.classList.contains('fluid-tab-panel')) { p.classList.remove('active'), p.style.display = 'none' } })
                            target.classList.add('active')
                            const panel = content ? content.querySelector(`[data-tab-content="${target.getAttribute('data-tab-target')}"]`) : null
                            if (panel) { panel.classList.add('active'), panel.style.display = 'block', panel.querySelectorAll('.CodeMirror').forEach(cm => cm.CodeMirror?.refresh()) }
                        }
                    })
                    /* Check Loaded Diagrams */
                    document.querySelectorAll('.graphviz-wrapper').forEach(div => {
                        const el = element(div)
                        if (el.getDataset('loaded')) return;
                        const canvas = el.resume().querySelector('.graphviz-canvas')
                        if (canvas && canvas.dataset.src) {
                            fetch(canvas.dataset.src).then(r => r.text()).then(svg => {
                                canvas.innerHTML = svg, el.dataset('loaded', true), setupZoom(el, canvas.querySelector('svg'))
                            }).catch(e => console.error(e))
                        }
                    })
                    processMermaid()
                        ;[500, 1500, 3000].forEach(t => setTimeout(processMermaid, t))
                })
            }
        ]
    }

    window.ConfigDocGeneral = ConfigDocGeneral;
    window.$docsify = ConfigDocGeneral;

    /* 8. INICIALIZACION (IIFE) */
    (function iniciarListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target
            if (window.innerWidth < 770) {
                const sidebar = document.querySelector('.sidebar'), toggle = document.querySelector('.sidebar-toggle')
                if (sidebar && toggle && (!sidebar.contains(target) && !toggle.contains(target) || target.closest('a'))) document.body.classList.add('close')
            }
            /* Commandos Modal */
            const cmd = target.closest('[command]')
            if (cmd) {
                const action = cmd.getAttribute('command'), id = cmd.getAttribute('commandfor')
                const el = id ? document.getElementById(id) : null
                if (el && action === 'show-modal') {
                    el.showModal(), document.body.style.overflow = 'hidden'
                    el.addEventListener('close', () => document.body.style.overflow = '', { once: true })
                }
                if (el && action === 'close') el.close()
            }
            if (target.tagName === 'DIALOG' && target.classList.contains('fluid-dialog')) target.close()
            if (e.pointerType === 'touch') return;
            const opened = document.querySelector('.medium-zoom-image.medium-zoom-image--opened')
            const isLoupe = target.classList.contains('fluid-loupe') || target.classList.contains('fluid-loupe-ghost')
            if (opened && (opened.contains(target) || isLoupe || target.classList.contains('medium-zoom-overlay'))) {
                opened._zoom ? opened._zoom.close() : opened.click()
                if (window.FluidDocHelpers && window.FluidDocHelpers.hideLoupe) window.FluidDocHelpers.hideLoupe()
                return
            }
            const img = (target.tagName === 'IMG' && target.classList.contains('medium-zoom-image') && !target.classList.contains('no-loupe')) ? target : null
            const mermaid = (target.closest('.mermaid') && (target.tagName === 'svg' || target.closest('svg'))) ? target : null
            if (img || mermaid) setTimeout(() => (window.FluidDocHelpers && window.FluidDocHelpers.setupLoupe) ? window.FluidDocHelpers.setupLoupe(mermaid ? (target.tagName === 'svg' ? target : target.closest('svg')) : target) : null, 300)
        })
        document.addEventListener('keyup', (e) => {
            if (e.key !== 'Escape') return;
            const opened = document.querySelector('.medium-zoom-image--opened')
            if (opened) { opened._zoom ? opened._zoom.close() : opened.click(); if (window.FluidDocHelpers && window.FluidDocHelpers.hideLoupe) window.FluidDocHelpers.hideLoupe() }
        })
        document.addEventListener("resize", () => { (window.innerWidth >= 770) && document.body.classList.remove('close') })
        document.addEventListener("DOMContentLoaded", () => {
            const params = new URLSearchParams(window.location.search), state = params.get('sidebar')
            state === 'collapsed' ? document.body.classList.add('close') : state === 'expanded' ? document.body.classList.remove('close') : (window.innerWidth < 770 && setTimeout(() => document.body.classList.add('close'), 10))
            const obs = new MutationObserver(() => {
                const closed = document.body.classList.contains('close')
                const url = new URL(window.location), nuevo = closed ? 'collapsed' : 'expanded'
                if (url.searchParams.get('sidebar') !== nuevo) { url.searchParams.set('sidebar', nuevo), history.replaceState(null, '', url) }
            })
            obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
        })
    })()
})()
