// @ts-nocheck
(() => {
    const { element, insertStyle } = window.FluidUI
    /** @type {number} */ let LOUPE_WIDTH; /** @type {number} */ let LOUPE_HEIGHT; let ZOOM_LEVEL = 2
    const clamp = (valor, min, max) => Math.max(min, Math.min(max, valor)) /** retorna valor limitado */
    /** @type {any} */ let loupe; /** @type {any} */ let loupeGhost; let lastMouseEvent = null, isHorizontal = false, activeObserver = null, currentObjectUrl = null, inactivityTimeout

    /** 2. Configuración y Eventos */
    document.addEventListener('click', (e) => {
        if (e.pointerType === 'touch') return
        const target = e.target, targetDocument = document.querySelector('.medium-zoom-image.medium-zoom-image--opened')
        if (targetDocument && targetDocument.classList.contains('medium-zoom-image')) setTimeout(() => targetDocument.classList.contains('medium-zoom-image--opened') && hideLoupe(), 300)

        const isImg = target.tagName === 'IMG' && target.classList.contains('medium-zoom-image')
        const isMermaid = target.closest('.mermaid') && (target.tagName === 'svg' || target.closest('svg'))
        if (isImg || isMermaid) setTimeout(() => setupLoupe(isMermaid ? (target.tagName === 'svg' ? target : target.closest('svg')) : target), 300)
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

        loupe = element('div', '.fluid-loupe'); loupeGhost = element('div', '.fluid-loupe-ghost')
        !document.body.contains(loupe.resume()) && document.body.appendChild(loupe.resume())
        !document.body.contains(loupeGhost.resume()) && document.body.appendChild(loupeGhost.resume())

        insertStyle({
            id: 'fluid-loupe-style',
            css: $ => ({
                ".fluid-loupe, .fluid-loupe-ghost": {
                    position: $.fixed, border: $.border({ width: 3, color: "white" }), boxShadow: $.boxShadow(0, 0, 10, $.rgba(0, 0, 0, 0.5)), borderRadius: 30, pointerEvents: $.none, backgroundRepeat: "no-repeat", willChange: "top, left, transform", width: $.px(LOUPE_WIDTH), height: $.px(LOUPE_HEIGHT),
                    "&.fluid-loupe": {
                        backgroundColor: "#000", zIndex: $.important(1000),
                        transition: $.transition([{ prop: "left", time: "0.5s", ease: "ease" }, { prop: "right", time: "0.5s", ease: "ease" }, { prop: "top", time: "0.5s", ease: "ease" }, { prop: "bottom", time: "0.5s", ease: "ease" }, { prop: "opacity", time: "0.5s", ease: "ease" }, { prop: "transform", time: "0.5s", ease: "ease" }])
                    },
                    "&.fluid-loupe-ghost": {
                        zIndex: $.important(999), transform: $.transform().translate("-50%", "-50%").scale(1 / ZOOM_LEVEL).str(), transformOrigin: "center center", transition: $.transition([{ prop: "opacity", time: "0.5s", ease: "ease" }])
                    }
                }
            })
        })
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

        const gRight = x + ghostHalfW, gBottom = y + ghostHalfH, gLeft = x - ghostHalfW, gTop = y - ghostHalfH
        const colisionEspectro = (gRight > lrLeft && gLeft < (lrLeft + LOUPE_WIDTH)) && (gBottom > lrTop && gTop < (lrTop + LOUPE_HEIGHT))
        const PERCENTAGE = isHorizontal ? 0.35 : 0.25

        if (isHorizontal) loupe.style($ => ({ top: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100), left: '50%', transform: $.transform().translateX("-50%").str() }))
        else loupe.style($ => ({ left: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100), top: '50%', transform: $.transform().translateY("-50%").str() }))

        loupeGhost.style($ => ({ top: $.px(clamp(y, rect.top + ghostHalfH, rect.bottom - ghostHalfH)), left: $.px(clamp(x, rect.left + ghostHalfW, rect.right - ghostHalfW)) }))

        const relX = x - rect.left, relY = y - rect.top, mbg = 10
        const bgX = clamp((relX * ZOOM_LEVEL) - (LOUPE_WIDTH / 2), -mbg, (rect.width - ghostWidth + mbg) * ZOOM_LEVEL)
        const bgY = clamp((relY * ZOOM_LEVEL) - (LOUPE_HEIGHT / 2), -mbg, (rect.height - ghostHeight + mbg) * ZOOM_LEVEL)
        loupe.style({ backgroundSize: `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`, backgroundPosition: `${-bgX}px ${-bgY}px` })
    }
})()
