// @ts-nocheck
(() => {
    const { StyleSingleton, element, insertStyle } = window.FluidUI;
    // Configuration
    let LOUPE_WIDTH;
    let LOUPE_HEIGHT;
    let ZOOM_LEVEL = 2;
    const clamp = (valor, min, max) => Math.max(min, Math.min(max, valor)); /* retorna valor limitado */

    console.log('Zoom Loupe: Script loaded (Event-driven version)');

    let loupe;
    let loupeGhost;
    let lastMouseEvent = null;
    let isHorizontal = false;

    let activeObserver = null;
    let currentObjectUrl = null; // To clean up object URLs

    // Listen for clicks on images to detect zoom start
    document.addEventListener('click', (e) => {
        const target = e.target;
        // Check for zoomed element (img or svg)
        const targetDocument = document.querySelector('.medium-zoom-image.medium-zoom-image--opened');

        if (targetDocument && targetDocument.classList.contains('medium-zoom-image')) {
            console.log('1) Zoom Loupe: Element clicked', targetDocument);
            // Wait for the zoom animation/class application
            setTimeout(() => {
                if (targetDocument.classList.contains('medium-zoom-image--opened')) {
                    hideLoupe();
                }
            }, 300);
        }

        // Check if clicked element is a zoomable image or mermaid svg
        const isImg = target.tagName === 'IMG' && target.classList.contains('medium-zoom-image');
        const isMermaid = target.closest('.mermaid') && (target.tagName === 'svg' || target.closest('svg'));

        if (isImg || isMermaid) {
            console.log('2) Zoom Loupe: Zoomable element clicked', target);
            // Wait for the zoom animation/class application
            setTimeout(() => {
                let actualTarget = target;
                if (isMermaid) {
                    // If clicked inside svg, find the svg element
                    actualTarget = target.tagName === 'svg' ? target : target.closest('svg');
                }
                setupLoupe(actualTarget);
            }, 300);
        }
    });

    // Helper for shared state
    const setLoupeState = (styles) => {
        if (loupe && loupe.style) loupe.style(styles);
        if (loupeGhost && loupeGhost.style) loupeGhost.style(styles);
    };

    function update() {
        const PERCENTAGE = isHorizontal ? 0.35 : 0.25;

        if (isHorizontal) {
            LOUPE_HEIGHT = window.innerHeight * PERCENTAGE;
            LOUPE_WIDTH = Math.min(LOUPE_HEIGHT * (16 / 9), window.innerWidth * 0.9);
        } else {
            LOUPE_WIDTH = window.innerWidth * PERCENTAGE;
            LOUPE_HEIGHT = Math.min(LOUPE_WIDTH * (16 / 9), window.innerHeight * 0.9);
        }

        loupe = element('div', '.fluid-loupe')
        loupeGhost = element('div', '.fluid-loupe-ghost')
        // Create elements using builder
        if (!document.body.contains(loupe.resume())) document.body.appendChild(loupe.resume());
        if (!document.body.contains(loupeGhost.resume())) document.body.appendChild(loupeGhost.resume());

        insertStyle({
            id: 'fluid-loupe-style',
            css: $ => ({
                ".fluid-loupe, .fluid-loupe-ghost": {
                    position: $.fixed,
                    border: $.border({ width: 3, color: "white" }),
                    boxShadow: $.boxShadow(0, 0, 10, $.rgba(0, 0, 0, 0.5)),
                    borderRadius: 30,
                    pointerEvents: $.none,
                    backgroundRepeat: "no-repeat",
                    willChange: "top, left, transform",
                    width: $.px(LOUPE_WIDTH),
                    height: $.px(LOUPE_HEIGHT),
                    "&.fluid-loupe": {
                        backgroundColor: "#000",
                        zIndex: $.important(1000),
                        transition: $.transition([
                            { prop: "left", time: "0.5s", ease: "ease" },
                            { prop: "right", time: "0.5s", ease: "ease" },
                            { prop: "top", time: "0.5s", ease: "ease" },
                            { prop: "bottom", time: "0.5s", ease: "ease" },
                            { prop: "opacity", time: "0.5s", ease: "ease" },
                            { prop: "transform", time: "0.5s", ease: "ease" }
                        ])
                    },
                    "&.fluid-loupe-ghost": {
                        zIndex: $.important(999),
                        transform: $.transform().translate("-50%", "-50%").scale(1 / ZOOM_LEVEL).str(),
                        transformOrigin: "center center",
                        transition: $.transition([{ prop: "opacity", time: "0.5s", ease: "ease" }])
                    }
                }
            })
        });
    }

    function onKeyUp(e) {
        if (e.key === 'Control') {
            isHorizontal = !isHorizontal;
            update();
            if (lastMouseEvent) onMouseMove(lastMouseEvent);
        }
    }

    function setupLoupe(target) {
        isHorizontal = false;
        update();
        ZOOM_LEVEL = 2;

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
        }

        let bgUrl = "";
        if (target.tagName === 'IMG') {
            bgUrl = target.src;
        } else if (target.tagName === 'svg' || target.tagName === 'SVG') {
            const svgData = new XMLSerializer().serializeToString(target);
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            currentObjectUrl = URL.createObjectURL(blob);
            bgUrl = currentObjectUrl;
        }

        loupe.style({ backgroundImage: `url("${bgUrl}")` });

        // Attach mouse move listener
        document.addEventListener('mousemove', onMouseMove, true);
        document.addEventListener('wheel', onWheel, { passive: false });
        document.addEventListener('keyup', onKeyUp);
        setLoupeState({ display: 'none' });
    }

    function hideLoupe() {
        console.log('Zoom Loupe: Hiding');
        setLoupeState({ display: 'none' });

        document.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('wheel', onWheel);
        document.removeEventListener('keyup', onKeyUp);

        if (activeObserver) {
            activeObserver.disconnect();
            activeObserver = null;
        }

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
        }
    }

    let inactivityTimeout;

    function resetInactivityTimer() {
        if (ZOOM_LEVEL < 1.2) {
            setLoupeState({ opacity: 0 });
            return;
        }

        setLoupeState({ opacity: 1 });

        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            setLoupeState({ opacity: 0 });
        }, 6000);
    }

    function onWheel(e) {
        const activeImage = document.querySelector('.medium-zoom-image--opened');
        if (!activeImage) return;

        e.preventDefault();
        e.stopPropagation();

        const delta = Math.sign(e.deltaY) * -0.1;
        ZOOM_LEVEL = clamp(ZOOM_LEVEL + delta, 1, 5);

        update();
        if (lastMouseEvent) onMouseMove(lastMouseEvent);
    }

    function onMouseMove(e) {
        lastMouseEvent = e;
        resetInactivityTimer();
        const activeImage = document.querySelector('.medium-zoom-image--opened');
        if (!activeImage) {
            setLoupeState({ display: 'none' });
            return;
        }

        update();

        const rect = activeImage.getBoundingClientRect();

        const x = e.clientX;
        const y = e.clientY;

        setLoupeState({ display: 'block' });


        const ghostWidth = LOUPE_WIDTH / ZOOM_LEVEL;
        const ghostHeight = LOUPE_HEIGHT / ZOOM_LEVEL;
        const ghostHalfW = ghostWidth / 2;
        const ghostHalfH = ghostHeight / 2;

        // Calculate Loupe Position (Default)
        let lrLeft, lrTop;

        if (isHorizontal) {
            // Horizontal Mode: Bottom, Centered Horizontally
            lrLeft = (window.innerWidth - LOUPE_WIDTH) / 2;
            lrTop = window.innerHeight - LOUPE_HEIGHT;
        } else {
            // Vertical Mode: Right, Centered Vertically
            lrLeft = window.innerWidth - LOUPE_WIDTH;
            lrTop = (window.innerHeight - LOUPE_HEIGHT) / 2;
        }

        // Ghost Bounds
        const gRight = x + ghostHalfW;
        const gBottom = y + ghostHalfH;
        const gLeft = x - ghostHalfW;
        const gTop = y - ghostHalfH;

        // Collision with Default Loupe Position
        const colisionEspectro = (gRight > lrLeft && gLeft < (lrLeft + LOUPE_WIDTH)) &&
            (gBottom > lrTop && gTop < (lrTop + LOUPE_HEIGHT));

        const PERCENTAGE = isHorizontal ? 0.35 : 0.25;

        if (isHorizontal) {
            // Horizontal Mode (Bottom Bar)
            loupe.style($ => ({
                top: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100),
                left: '50%',
                transform: $.transform().translateX("-50%").str()
            }));
        } else {
            // Vertical Mode (Right Bar)
            loupe.style($ => ({
                left: colisionEspectro ? '0' : $.percent((1 - PERCENTAGE) * 100),
                top: '50%',
                transform: $.transform().translateY("-50%").str()
            }));
        }

        loupeGhost.style($ => ({
            top: $.px(clamp(y, rect.top + ghostHalfH, rect.bottom - ghostHalfH)),
            left: $.px(clamp(x, rect.left + ghostHalfW, rect.right - ghostHalfW))
        }));

        const relX = x - rect.left;
        const relY = y - rect.top;

        const mbg = 10;

        const bgX = clamp((relX * ZOOM_LEVEL) - (LOUPE_WIDTH / 2), -mbg, (rect.width - ghostWidth + mbg) * ZOOM_LEVEL);
        const bgY = clamp((relY * ZOOM_LEVEL) - (LOUPE_HEIGHT / 2), -mbg, (rect.height - ghostHeight + mbg) * ZOOM_LEVEL);

        loupe.style({
            backgroundSize: `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`,
            backgroundPosition: `${-bgX}px ${-bgY}px`
        });
    }

})();
