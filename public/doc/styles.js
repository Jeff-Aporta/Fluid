// @ts-nocheck
const mermaid = window.mermaid;
if (mermaid) {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        // flowchart: { defaultRenderer: 'elk' }
    });
}
(function docStyles() {
    /** 2. Variables */
    const { StyleSingleton, HELPERS: $ } = window.FluidUI
    /** UI Colors & Constants */
    /** Aurora Background */
    const auroraStop1 = [$.rgba(255, 20, 147, 0.15), 0]; const auroraStop2 = [$.rgba(0, 255, 255, 0.12), 0]
    const auroraStop3 = [$.rgba(138, 43, 226, 0.18), 0]; const auroraStop4 = [$.rgba(255, 215, 0, 0.08), 0]; const auroraBgBase = "#000000"
    /** Theme Variables */
    const themePrimary = "#00AEEF"; const themePrimaryLight = "#33C1F3"; const themePrimaryDark = "#0090C7"
    const themeSecondary = "#2c3e50"; const themeAccent = "#42b983"
    const bgPrimary = $.rgba(149, 186, 255, 0.2); const bgSecondary = $.rgba(128, 128, 128, 0.1); const bgCode = "#1e293b"
    const textPrimary = "#5a9bdd"; const textSecondary = "#86a5c3"; const textMuted = "#8492a6"; const borderColor = "#80808080"
    const shadowColorSm = $.rgba(0, 0.08); const shadowColorMd = $.rgba(0, 0.12); const shadowColorLg = $.rgba(0, 0.15)
    /** Code specific var */
    const bgCodeTransparent = $.transparent
    /** Tabs */
    const tabsBorder = '#333'; const tabsBg = '#0d1117'; const tabsHeaderBg = '#161b22'
    const tabsBtnText = '#8b949e'; const tabsBtnTextHover = '#c9d1d9'; const tabsBtnBgHover = '#21262d'; const tabsActive = '#58a6ff'
    /** Sidebar & Layout */
    const sidebarBg = "rgb(14, 14, 36)"; const sidebarHeaderBg = "rgb(21, 21, 58)"; const sidebarToggleBg = "rgb(19, 19, 52)"
    const sidebarInputBg = "#333"; const sidebarInputColor = "#fff"; const sidebarInputBorder = "#555"
    const sidebarNavLinkConfigActive = $.rgba(0, 174, 239, 0.15); const sidebarToggleBorder = $.rgba(128, 128, 128, 0.5)
    const SIDEBAR_WIDTH = $.max($.vw(20), 300);
    const sidebarWidthMobile = $.important($.vw(90))
    /** Scrollbar */
    const scrollbarTrack = "rgb(14, 14, 36)"; const scrollbarThumbHover = $.rgba(68, 0, 255, 1)
    const scrollbarThumbHoverActive = $.rgba(0, 174, 239, 0.4); const scrollbarTrackHover = "midnightblue"; const scrollbarWidth = 6
    const bgScrollbarThumb = "rgba(38, 38, 105, 1)" /** Using same as track by default in code */; const transitionBase = "0.3s ease"
    /** Components & Elements */
    const tableHeaderBg = "rgb(21, 21, 69)"; const zoomOverlayBg = '#0f172a'
    const blockquoteBgStop1 = $.rgba(0, 174, 239, 0.05); const tableBg = $.rgba(0, 0, 0, 0.5); const tableRowHover = $.rgba(0, 174, 239, 0.05)
    const tipBgStop1 = $.rgba(255, 102, 102, 0.1); const tipBorder = "#f66"
    const tipSymbolColor = "#f66"; const tipSymbolText = "white"; const tipCodeBg = $.rgba(255, 102, 102, 0.1); const warnBgStop1 = $.rgba(66, 185, 131, 0.1)
    /** CodeMirror & Syntax */
    const cmBg = sidebarBg; const cmColor = "#d6deeb"; const cmBorder = $.rgba(255, 255, 255, 0.1)
    const cmShadow = $.rgba(0, 0, 0, 0.3); const cmGutterBorder = $.rgba(255, 255, 255, 0.05)
    const cmLineNumber = "#4b6479"; const cmCursor = "#80a4c2"
    const cmSelected = $.rgba(29, 59, 83, 0.5)
    const cmScrollThumb = $.rgba(255, 255, 255, 0.1); const cmScrollThumbHover = $.rgba(255, 255, 255, 0.2)
    const cmKeyword = "#c792ea"; const cmAtom = "#f78c6c"; const cmDef = "#82aaff"
    const cmVariable = "#d6deeb"; const cmVariable2 = "#addb67"; const cmVariable3 = "#7fdbca"
    const cmProperty = "#80cbc4"; const cmString = "#ecc48d"; const cmComment = "#637777"
    const cmTag = "#7fdbca"; const cmAttribute = "#addb67"; const cmOperator = "#c792ea"; const cmMeta = "#82aaff"; const cmBuiltin = "#82aaff"
    /** Tokens */
    const tokenComment = "#8e908c"; const tokenBoolean = "#0099CC"; const tokenPunctuation = "#525252"
    const tokenProperty = "#0088BB"; const tokenTag = "#0066CC"; const tokenSelector = "#5599FF"
    const tokenAttrName = "#0066CC"; const tokenEntity = "#00AEEF"; const tokenKeyword = "#1E90FF"
    const tokenStatement = "#00AEEF"; const tokenVariable = "#4DA6FF"; const tokenInserted = "#202746"
    const tokenImportant = "#FF6B6B"; const tokenNamespace = 0.7
    /** Cover */
    const coverBgStop2 = $.rgba(95, 30, 85, 0.3); const coverMaskStop2 = $.rgba(10, 22, 40, 0.5); const coverMaskStop3 = "#0a1628"
    const coverBtnShadow = $.rgba(0, 174, 239, 0.2); const coverBtnShadowHover = $.rgba(0, 174, 239, 0.3)
    const coverBtnPrimaryShadow = $.rgba(0, 174, 239, 0.4); const coverTitleShadow = $.rgba(0, 174, 239, 0.3)
    /** Footer & Misc */
    const githubCornerColor = "white"; const logoCornerShadow = "white"
    const footerBg = $.rgba(0, 0, 0, 0.2); const footerBorder = $.rgba(255, 255, 255, 0.05)
    const footerBgHover = $.rgba(0, 0, 0, 0.4); const footerBorderHover = $.rgba(255, 255, 255, 0.1); const creatorInfoColor = $.rgba(255, 255, 255, 0.5)
    const socialBtnBg = $.rgba(255, 255, 255, 0.05); const socialBtnColor = $.rgba(255, 255, 255, 0.6)
    const socialBtnBorder = $.rgba(255, 255, 255, 0.05); const socialBtnHoverShadow = $.rgba(0, 174, 239, 0.3); const pulseText = "#000"
    /** Background Definition */
    const bg = $.background(
        $.radialGradient({ shape: "ellipse 120% 80%", at: { x: "70%", y: "20%" }, stops: [auroraStop1, [$.transparent, 50]] }),
        $.radialGradient({ shape: "ellipse 100% 60%", at: { x: "30%", y: "10%" }, stops: [auroraStop2, [$.transparent, 60]] }),
        $.radialGradient({ shape: "ellipse 90% 70%", at: { x: "50%", y: "0%" }, stops: [auroraStop3, [$.transparent, 65]] }),
        $.radialGradient({ shape: "ellipse 110% 50%", at: { x: "80%", y: "30%" }, stops: [auroraStop4, [$.transparent, 40]] }),
        auroraBgBase
    )
    /** Style Helpers - Reduccion de Redundancias */
    const borderLeft4 = color => ({ borderLeft: { width: 4, color } })
    const transitionAll = (time = transitionBase) => [{ prop: "all", time }]
    const boxShadowSm = { dY: 2, blur: 8, color: shadowColorSm }
    const gradientTitle = $.linearGradient({ dir: 135, stops: [themePrimary, themePrimaryLight] })
    const textGradient = { background: gradientTitle, webkitBackgroundClip: "text", webkitTextFillColor: $.transparent, backgroundClip: "text" }
    const linkBase = { fontWeight: 500, textDecoration: $.none }
    const scrollbarStyles = (width = scrollbarWidth, track = scrollbarTrack, thumb = bgScrollbarThumb) => ({
        "&::-webkit-scrollbar": { width },
        "&::-webkit-scrollbar-track": { background: track },
        "&::-webkit-scrollbar-thumb": { background: thumb, borderRadius: 4, transition: [{ prop: "background", time: transitionBase }] }
    })
    /** Listeners */
    document.addEventListener("click", (e) => e.target.classList.contains("sidebar-toggle") && document.body.classList.toggle("close"))
    /** 3. Inicialización de Estilos */
    StyleSingleton.add("doc-styles-base", {
        initheader: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap");',
        code: {
            vars: { bgCode: bgCodeTransparent }
        },
        "#CDN-script": {
            display: window.location.hostname === "jeff-aporta.github.io" ? "block" : "none"
        },
        "*": {
            webkitFontSmoothing: $.antialiased, mozOsxFontSmoothing: "grayscale",
            webkitOverflowScrolling: $.touch, webkitTapHighlightColor: $.transparent, webkitTextSizeAdjust: $.none, webkitTouchCallout: $.none, boxSizing: $.borderBox,
            ...scrollbarStyles(),
            "&:hover::-webkit-scrollbar-thumb": {
                background: scrollbarThumbHover,
                "&:hover": { background: scrollbarThumbHoverActive }
            },
            "&:hover::-webkit-scrollbar-track": { background: scrollbarTrackHover },
        },
        details: {
            interpolateSize: "allow-keywords", transition: [{ prop: "height", time: "0.3s", ease: "ease" }],
            "&:not([open]) summary": { background: "#08a", color: "white", borderRadius: 6 },
            "&:not([open]) summary code": { color: "white" },
            "&.secondary:not([open]) summary": { background: "#5d3da9" }
        },
        "html, body": { minHeight: $.percent(100), margin: 0, padding: 0 },
        strong: { color: "dodgerblue" },
        "p, td:not(:nth-child(1)), li": { code: { color: "deepskyblue" } },
        "td:nth-child(1)": { code: { color: "hotpink" } },

        ".cover, .cover-main, mask": { background: $.important(bg), margin: $.important(0), minHeight: $.important($.vh(100)) },
        body: {
            fontFamily: $.font("Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"), fontSize: 15, lineHeight: 1.6, color: textPrimary, backgroundColor: $.important(bgPrimary), overflowX: $.hidden, position: $.relative,
            "&:not(.ready)": {
                overflow: $.hidden,
                "[data-cloak], .app-nav, >nav": { display: $.none }
            },
            "&.close": {
                ".sidebar": { marginLeft: $.calc($.mult(-1, SIDEBAR_WIDTH)) },
                ".sidebar-toggle": { width: $.auto, marginRight: 0 },
                vars: { sideBarOpen: 0 }
            },
            vars: { sideBarOpen: 1, isBigW: 1 },
            /** Aurora Background */
            "&::before": { content: $.text(""), position: $.fixed, inset: 0, zIndex: -1, background: bg }
        },
        "#app": {
            fontSize: 28, fontWeight: 300, margin: [40, $.auto], textAlign: $.center, color: themePrimary,
            "&:empty::before": { content: "'Cargando...'" }
        },
        ".progress": {
            ...$.important({ background: $.linearGradient({ to: $.right, stops: [themePrimary, themePrimaryLight] }), height: 4, boxShadow: { blur: 15, color: themePrimary } }), left: 0, position: $.fixed, right: 0, top: 0, width: $.percent(0), zIndex: 999999, transition: [{ prop: "width", time: transitionBase }, { prop: "opacity", time: "0.4s" }]
        },
        img: {
            maxWidth: "100%",
            "&.emoji": { height: $.em(1.2), verticalAlign: $.middle }
        },
        span: {
            "&.emoji": { fontFamily: $.font("Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"), fontSize: $.em(1.2), verticalAlign: $.middle }
        },
        a: {
            "&[disabled]": { cursor: $.notAllowed, opacity: 0.6 }
        },
        kbd: {
            background: bgCode, border: { color: borderColor }, borderRadius: 4, boxShadow: { dY: 1, color: shadowColorSm }, display: $.inlineBlock, fontSize: 12, fontFamily: $.fontFamily("Fira Code", "monospace"), lineHeight: 12, marginBottom: 3, padding: [4, 6], verticalAlign: "middle"
        },
        li: {
            "input[type='checkbox']": { margin: [0, 0.2, 0.25, 0, $.em], verticalAlign: "middle" }
        },
        ".medium-zoom-overlay": {
            background: $.important(zoomOverlayBg),
        },
        ".fluid-loupe, .fluid-loupe-ghost": {
            position: $.fixed, border: $.border({ width: 3, color: "white" }), boxShadow: $.boxShadow({ blur: 10, color: $.rgba(0, 0, 0, 0.5) }), borderRadius: 30, pointerEvents: "none", backgroundRepeat: "no-repeat", willChange: "top, left, transform",
            "&.fluid-loupe": {
                backgroundColor: "#000", zIndex: $.important(20000),
                transition: $.transition([{ prop: "left", time: "0.5s", ease: "ease" }, { prop: "right", time: "0.5s", ease: "ease" }, { prop: "top", time: "0.5s", ease: "ease" }, { prop: "bottom", time: "0.5s", ease: "ease" }, { prop: "opacity", time: "0.5s", ease: "ease" }, { prop: "transform", time: "0.5s", ease: "ease" }])
            },
            "&.fluid-loupe-ghost": {
                zIndex: $.important(19999), transformOrigin: "center center", transition: $.transition([{ prop: "opacity", time: "0.5s", ease: "ease" }])
            }
        },
        "@keyframes dashAnimation": {
            from: { strokeDashoffset: 20 },
            to: { strokeDashoffset: 0 }
        },
        ".flow path": { animation: [{ name: "dashAnimation", duration: "1s", timing: "linear", iter: "infinite" }], ...$.important({ strokeDasharray: $.joinComma(5, 5) }) },
        "@keyframes glowPulse": {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.6 },
            "100%": { opacity: 1 }
        },
        ".pulse polygon, .pulse path": { animation: [{ name: "glowPulse", duration: "2s", timing: "ease-in-out", iter: "infinite" }] },
        ".pulse text": { fontWeight: "bold", ...$.important({ fill: pulseText }) }
    })
    StyleSingleton.add("doc-styles-codemirror", {
        ".code-editor": { display: $.none },
        ".CodeMirror": {
            fontFamily: $.fontFamily("Consolas", "Monaco", "Courier New", "monospace"), color: cmColor, direction: "ltr",
            position: $.relative, overflow: $.hidden, backgroundColor: cmBg,
            borderRadius: 8, border: { color: cmBorder }, width: $.percent(100), minHeight: 10, boxShadow: { dY: 10, blur: 30, color: cmShadow },
            ".CodeMirror-lines": { padding: [4, 0], cursor: "text", minHeight: 1 },
            "pre.CodeMirror-line, pre.CodeMirror-line-like": { padding: [0, 4], borderRadius: 0, borderWidth: 0, background: $.transparent, fontFamily: $.inherit, fontSize: $.inherit, margin: 0, whiteSpace: "pre", wordWrap: $.normal, lineHeight: $.inherit, color: $.inherit, zIndex: 2, position: $.relative, overflow: $.visible, webkitTapHighlightColor: $.transparent, fontVariantLigatures: "contextual" },
            ".CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler": { backgroundColor: cmBg, position: $.absolute, zIndex: 6, display: $.none, outline: 0 },
            ".CodeMirror-gutters": { borderRight: { color: cmGutterBorder }, backgroundColor: cmBg, whiteSpace: $.nowrap, position: $.absolute, left: 0, top: 0, minHeight: $.percent(100), zIndex: 3, boxSizing: "content-box" },
            ".CodeMirror-linenumber": { padding: [0, 3, 0, 5], minWidth: 20, textAlign: $.right, color: cmLineNumber, whiteSpace: $.nowrap, boxSizing: "content-box" },
            ".CodeMirror-guttermarker, .CodeMirror-guttermarker-subtle": { color: cmColor, "&.CodeMirror-guttermarker-subtle": { color: cmComment } },
            ".CodeMirror-cursor": { borderLeft: { color: cmCursor }, borderRight: { style: "none" }, width: 0, position: $.absolute, pointerEvents: $.none },
            "div.CodeMirror-secondarycursor": { borderLeft: { color: "silver" } },
            ".CodeMirror-rulers": { position: $.absolute, left: 0, right: 0, top: -50, bottom: 0, overflow: $.hidden },
            ".CodeMirror-ruler": { borderLeft: { color: cmBorder }, top: 0, bottom: 0, position: $.absolute },
            ".CodeMirror-composing": { borderBottom: { width: 2 } },
            "span.CodeMirror-matchingbracket": { color: "#0b0" },
            "span.CodeMirror-nonmatchingbracket": { color: "#a22" },
            ".CodeMirror-matchingtag": { background: $.rgba(255, 150, 0, .3) },
            ".CodeMirror-activeline-background": { background: cmSelected },
            "::-webkit-scrollbar": { width: 8, height: 8 },
            "::-webkit-scrollbar-track": { background: $.transparent },
            "::-webkit-scrollbar-thumb": { background: cmScrollThumb, borderRadius: 4, transition: [{ prop: "background", time: "0.2s" }], "&:hover": { background: cmScrollThumbHover } },
            ".CodeMirror-scroll": {
                marginBottom: -50, marginRight: -50, paddingBottom: 50, height: $.percent(100), outline: 0, position: $.relative, zIndex: 0, boxSizing: "content-box", ...$.important({ overflow: "scroll" })
            },
            ".CodeMirror-sizer": { position: $.relative, borderRight: { width: 50, color: $.transparent }, boxSizing: "content-box" },
            ".CodeMirror-vscrollbar": {
                right: 0, top: 0, overflowX: $.hidden, overflowY: "scroll", position: $.absolute, zIndex: 6, outline: 0,
                "::-webkit-scrollbar": { width: "8px" }
            },
            ".CodeMirror-hscrollbar": {
                bottom: 0, left: 0, overflowY: $.hidden, overflowX: "scroll", position: $.absolute, zIndex: 6, outline: 0,
                "::-webkit-scrollbar": { height: "8px" }
            },
            ".CodeMirror-gutter": { whiteSpace: $.normal, height: $.percent(100), display: $.inlineBlock, verticalAlign: $.top, marginBottom: -50, boxSizing: "content-box" },
            ".CodeMirror-gutter-wrapper": { position: $.absolute, zIndex: 4, ...$.important({ background: $.transparent, border: { style: "none" } }), "::selection": { backgroundColor: $.transparent }, "::-moz-selection": { backgroundColor: $.transparent } },
            ".CodeMirror-gutter-background": { position: $.absolute, top: 0, bottom: 0, zIndex: 4 },
            ".CodeMirror-gutter-elt": { position: $.absolute, cursor: "default", zIndex: 4 },
            ".CodeMirror-linebackground": { position: $.absolute, left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 },
            ".CodeMirror-linewidget": { position: $.relative, zIndex: 2, padding: .1 },
            ".CodeMirror-code": { outline: 0 },
            ".CodeMirror-measure": { position: $.absolute, width: $.percent(100), height: 0, overflow: $.hidden, visibility: $.hidden, "pre": { position: $.static } },
            "div.CodeMirror-cursors": { visibility: $.hidden, position: $.relative, zIndex: 3 },
            "div.CodeMirror-dragcursors": { visibility: $.visible },
            ".CodeMirror-crosshair": { cursor: "crosshair" },
            ".CodeMirror-line::selection, .CodeMirror-line>span::selection, .CodeMirror-line>span>span::selection": { background: cmSelected },
            ".CodeMirror-line::-moz-selection, .CodeMirror-line>span::-moz-selection, .CodeMirror-line>span>span::-moz-selection": { background: cmSelected },
            "span.CodeMirror-selectedtext": { background: $.transparent }
        },
        ".CodeMirror-focused": { ".CodeMirror-selected": { background: $.important(cmSelected) }, "div.CodeMirror-cursors": { visibility: $.visible } },
        ".CodeMirror-wrap": { "pre.CodeMirror-line, pre.CodeMirror-line-like": { wordWrap: "break-word", whiteSpace: "pre-wrap", wordBreak: $.normal } },
        ".CodeMirror-rtl pre": { direction: "rtl" },
        ".CodeMirror-selected": { background: cmSelected },
        ".cm-searching": { backgroundColor: $.rgba(255, 255, 0, .4) },
        ".cm-force-border": { paddingRight: ".1px" },
        "@media print": { ".CodeMirror div.CodeMirror-cursors": { visibility: $.hidden } },
        ".cm-tab-wrap-hack:after": { content: $.text("") },
        "@keyframes blink": { "50%": { backgroundColor: $.transparent } },
        ".cm-tab": { display: $.inlineBlock, textDecoration: $.inherit },
        /** Fat Cursor */
        ".cm-fat-cursor": {
            caretColor: $.transparent,
            ".CodeMirror-cursor": { width: $.auto, background: "#7e7", ...$.important({ border: 0 }) },
            "div.CodeMirror-cursors": { zIndex: 1 },
            ".CodeMirror-line::selection, .CodeMirror-line>span::selection, .CodeMirror-line>span>span::selection": { background: $.transparent },
            ".CodeMirror-line::-moz-selection, .CodeMirror-line>span::-moz-selection, .CodeMirror-line>span>span::-moz-selection": { background: $.transparent },
        },
        /** Syntax Highlighting - Night Owl Palette */
        ".cm-s-vscode-dark": {
            "span.cm-keyword": { color: $.important(cmKeyword), fontStyle: "italic" },
            "span.cm-atom, span.cm-number": { color: $.important(cmAtom) },
            "span.cm-def": { color: $.important(cmDef) },
            "span.cm-variable": { color: $.important(cmVariable) },
            "span.cm-variable-2": { color: $.important(cmVariable2) },
            "span.cm-variable-3": { color: $.important(cmVariable3) },
            "span.cm-property": { color: $.important(cmProperty) },
            "span.cm-string": { color: $.important(cmString) },
            "span.cm-comment": { color: $.important(cmComment), fontStyle: "italic" },
            "span.cm-tag": { color: $.important(cmTag) },
            "span.cm-attribute": { color: $.important(cmAttribute) },
            "span.cm-operator": { color: $.important(cmOperator) },
            "span.cm-meta": { color: $.important(cmMeta) },
            "span.cm-builtin": { color: $.important(cmBuiltin) }
        }
    })
    StyleSingleton.add("doc-styles-components", {
        ".mermaid": {
            svg: { display: $.block, margin: [0, $.auto] }
        },
        ".graphviz-wrapper, .mermaid-wrapper": {
            display: $.important($.flex), alignItems: $.center, justifyContent: $.center, background: bgCode,
            position: $.relative, border: { color: borderColor }, borderRadius: 8, boxShadow: boxShadowSm, margin: [1.5, 0, $.em], padding: 20, overflow: $.hidden,
            "img, svg": { maxHeight: $.vh(80), maxWidth: $.vw(80) }
        },
        ".markdown-section": {
            margin: [0, $.auto], maxWidth: $.calc($.sub($.vw(98), $.mult(SIDEBAR_WIDTH, $.cssVar({ sideBarOpen: 0 }), $.cssVar({ isBigW: 0 })))), padding: [30, 10, 30, $.lerpcss({ from: { value: 0, width: 770 }, to: { value: 0, width: 1400 } })], position: $.relative,
            ">*": { boxSizing: $.borderBox, fontSize: "inherit" },
            "> :first-child": { marginTop: $.important(0) },
            "h1, h2, h3, h4, h5, h6": {
                fontWeight: 600, position: $.relative,
                "&:hover .anchor": { opacity: 1 }
            },
            h1: {
                fontSize: $.rem(2.5), margin: [0, 0, 2, $.rem], fontWeight: 700, ...textGradient
            },
            h2: { fontSize: $.rem(2), margin: [3, 0, 1.5, $.rem], paddingBottom: $.rem(0.5), borderBottom: { width: 2, color: borderColor } },
            h3: { fontSize: $.rem(1.5), margin: [2.5, 0, 1, $.rem] },
            h4: { fontSize: $.rem(1.25), margin: [2, 0, 0.8, $.rem] },
            "h5, h6": { fontSize: $.rem(1), color: textSecondary },
            a: {
                color: themePrimary, ...linkBase, borderBottom: { color: $.transparent }, transition: transitionAll("0.15s"),
                "&:hover": { borderBottomColor: themePrimary }
            },
            "p:not(details p), ul, ol": { lineHeight: 1.8, margin: [1.5, 0, $.em], color: textSecondary },
            "ul, ol": { paddingLeft: $.rem(1.5) },
            blockquote: {
                background: $.linearGradient({ dir: 90, stops: [blockquoteBgStop1, $.transparent] }), ...borderLeft4(themePrimary), color: textSecondary, margin: [2, 0, $.em], padding: [1, 1.5, $.rem], borderRadius: $.joinSpace(0, 8, 8, 0),
                p: {
                    fontWeight: 500, margin: [0.5, 0, $.em], color: textPrimary,
                    "&:first-child": { marginTop: 0 },
                    "&:last-child": { marginBottom: 0 }
                }
            },
            pre: {
                background: bgCode, borderRadius: 8, margin: [1.5, 0, $.em], padding: [1.5, $.rem], overflowX: $.auto, position: $.relative, boxShadow: boxShadowSm,
                ">code": { background: $.none, color: textPrimary, fontSize: $.rem(0.875), padding: 0, lineHeight: 1.6, display: $.block },
                "&::after": { content: "attr(data-lang)", position: $.absolute, top: $.rem(0.5), right: $.rem(1), color: textMuted, fontSize: $.rem(0.75), fontWeight: 600, textTransform: $.uppercase, letterSpacing: $.em(0.05) }
            },
            table: {
                borderCollapse: "collapse", borderSpacing: 0, margin: [2, 0, $.rem], overflow: $.auto, width: $.percent(100), borderRadius: 8, boxShadow: boxShadowSm, border: { color: borderColor }, backgroundColor: tableBg,
                th: { background: tableHeaderBg, border: { color: borderColor }, fontWeight: 600, padding: [12, 16], color: textPrimary },
                td: { border: { color: borderColor }, padding: [12, 16], color: textSecondary },
                tr: {
                    "&:nth-child(2n)": { background: bgSecondary },
                    "&:hover": { background: tableRowHover }
                }
            },
            hr: { border: { style: "none" }, borderTop: { width: 2, color: borderColor }, margin: [3, 0, $.em] },
            "p.tip": {
                background: $.linearGradient({ dir: 90, stops: [tipBgStop1, $.transparent] }), ...borderLeft4(tipBorder), borderRadius: $.joinSpace(0, 8, 8, 0), margin: [2, 0, $.em], padding: [1, 1.5, 1, 3, $.rem], position: $.relative,
                "&::before": { content: "'!'", position: $.absolute, left: $.rem(1), top: $.rem(1), background: tipBorder, color: tipSymbolText, width: 24, height: 24, borderRadius: $.percent(50), display: $.flex, alignItems: $.center, justifyContent: $.center, fontWeight: 700, fontSize: 14 },
                code: { background: tipCodeBg }
            },
            "p.warn": { background: $.linearGradient({ dir: 90, stops: [warnBgStop1, $.transparent] }), ...borderLeft4(themeAccent), borderRadius: $.joinSpace(0, 8, 8, 0), padding: [1, 1.5, $.rem] },
            "ul.task-list>li": { listStyleType: $.none }
        },
        ".anchor": {
            display: $.inlineBlock, textDecoration: $.none,
            "&:not(:is(a))": { opacity: 0 },
            transition: [{ prop: "opacity", time: transitionBase }], marginLeft: $.rem(0.5),
            span: { color: themePrimary },
            "&:hover": { textDecoration: $.none }
        },
        "section.cover": {
            position: $.relative, alignItems: $.center, justifyContent: $.center, background: $.important($.linearGradient({ dir: 135, stops: [$.transparent, [coverBgStop2, 100]] })), backgroundPosition: $.center, backgroundRepeat: "no-repeat", backgroundSize: "cover", minHeight: $.vh(100), width: $.percent(100), display: $.none,
            "&.show": { display: $.flex },
            "&.has-mask .mask": { background: $.linearGradient({ dir: "to bottom", stops: [$.transparent, [coverMaskStop2, 50], [coverMaskStop3, 95]] }), position: $.absolute, top: 0, bottom: 0, width: $.percent(100) },
            ".cover-main": {
                display: $.flex, flexDirection: "column", alignItems: $.center, justifyContent: $.center,
                p: {
                    "&:has(code), &:has(img)": { padding: 0, marginBottom: $.important(0) }
                },
                h2: { marginBottom: $.important(0), marginTop: $.important(0) },
                code: { fontSize: 14 },
                flex: 1, margin: [0, 16], textAlign: $.center, position: $.relative, zIndex: 1,
                ">p:last-child a": {
                    border: { width: 2, color: themePrimary }, borderRadius: 50, color: themePrimary, display: $.inlineBlock, fontSize: $.rem(1.05), fontWeight: 600, letterSpacing: $.em(0.05), margin: [10, 0], padding: [5, 25], textDecoration: $.none, transition: [{ prop: "all", time: transitionBase }], boxShadow: { dY: 4, blur: 12, color: coverBtnShadow },
                    "&:hover": { transform: $.transform().translateY(-2).str(), boxShadow: { dY: 8, blur: 20, color: coverBtnShadowHover } },
                    "&:last-child": {
                        background: $.linearGradient({ dir: 135, stops: [themePrimary, themePrimaryLight] }), color: "white", borderColor: $.transparent,
                        "&:hover": { boxShadow: { dY: 8, blur: 24, color: coverBtnPrimaryShadow } }
                    }
                }
            },
            a: {
                color: "inherit", textDecoration: $.none,
                "&:hover": { textDecoration: $.none }
            },
            p: { lineHeight: 1.8, margin: 0, color: textSecondary, fontSize: $.rem(1.1) },
            h1: {
                color: themePrimary, fontSize: $.rem(3.5), fontWeight: 700, margin: 0, position: $.relative, textAlign: $.center, background: $.linearGradient({ dir: "to right", stops: [themePrimary, "#fff"] }), webkitBackgroundClip: "text", webkitTextFillColor: $.transparent, textShadow: $.joinSpace(0, 0, 30, 0, coverTitleShadow),
                a: { display: $.block, height: "fit-content" },
                small: { bottom: $.rem(-0.5), fontSize: $.rem(1.25), fontWeight: 400, position: $.absolute, color: textMuted }
            },
            blockquote: {
                fontSize: $.rem(1.5), textAlign: $.center, color: textSecondary, fontWeight: 300,
                ">p>a": {
                    borderBottom: { width: 2, color: themePrimary }, transition: [{ prop: "color", time: transitionBase }],
                    "&:hover": { color: themePrimary }
                }
            },
            ul: { lineHeight: 2, listStyleType: $.none, margin: [2, $.auto, $.em], maxWidth: 500, padding: 0 },
            "img[alt='logo']": { width: 250, height: $.auto, objectFit: "cover" }
        },
        ".github-corner": {
            borderBottom: 0, position: $.fixed, right: 0, textDecoration: $.none, top: 0, zIndex: 1, transition: [{ prop: "transform", time: transitionBase }],
            "&:hover": {
                transform: $.transform().scale(1.05).str(),
                ".octo-arm": { animation: [{ name: "octocat-wave", duration: "560ms", timing: "ease-in-out" }] }
            },
            svg: { color: githubCornerColor, fill: themePrimary, height: 80, width: 80 }
        },
        "@keyframes octocat-wave": {
            "0%, 100%": { transform: $.transform().rotate("0deg").str() },
            "20%, 60%": { transform: $.transform().rotate("-25deg").str() },
            "40%, 80%": { transform: $.transform().rotate("10deg").str() }
        },

        ".token": {
            "&.comment, &.prolog, &.doctype, &.cdata": { color: tokenComment },
            "&.namespace": { opacity: tokenNamespace },
            "&.boolean, &.number": { color: tokenBoolean },
            "&.punctuation": { color: tokenPunctuation },
            "&.property": { color: tokenProperty },
            "&.tag": { color: tokenTag },
            "&.string": { color: themePrimary },
            "&.selector": { color: tokenSelector },
            "&.attr-name": { color: tokenAttrName },
            "&.entity, &.url": { color: tokenEntity },
            "&.attr-value, &.control, &.directive, &.unit": { color: themePrimary },
            "&.keyword, &.function": { color: tokenKeyword },
            "&.statement, &.regex, &.atrule": { color: tokenStatement },
            "&.placeholder, &.variable": { color: tokenVariable },
            "&.deleted": { textDecoration: "line-through" },
            "&.inserted": { borderBottom: "1px dotted #202746", textDecoration: $.none },
            "&.italic": { fontStyle: "italic" },
            "&.important, &.bold": { fontWeight: "bold" },
            "&.important": { color: tokenImportant },
            "&.entity": { cursor: "help" }
        },
        ".insoft-logo-corner": {
            top: 0, right: 10, width: 130, height: $.auto, zIndex: 100,
            vars: { br: "0.4px" },
            filter: $.filter(...Array.from({ length: 10 }, (_, i) => $.dropShadow({ blur: 0.4, color: logoCornerShadow })))
        },
        "@media print": {
            ".github-corner, .sidebar-toggle, .sidebar, .app-nav": { display: $.none }
        }
    })
    StyleSingleton.add("doc-styles-layout-improvements-responsive", {
        main: {
            display: $.flex, alignItems: $.flexStart, position: $.relative, width: $.vw(100), zIndex: 0,
            "&.hidden": { display: $.none }
        },
        ".sidebar": {
            background: sidebarBg, overflowY: $.auto, padding: 0, position: $.sticky, top: 0, left: 0, height: $.vh(100), flexShrink: 0, transition: [{ prop: "margin-left", time: "250ms", ease: $.cubicBezier(0.4, 0, 0.2, 1) }], width: SIDEBAR_WIDTH, zIndex: 20,
            ".sidebar-header": {
                width: $.percent(100), zIndex: 25, background: sidebarHeaderBg, paddingTop: 60, paddingBottom: 10,
                ".app-name": {
                    margin: 0, padding: 0, textAlign: $.center,
                    "&, :visited, :link, :hover, :active": { color: textPrimary, textDecoration: "unset" }
                },
                ">h1": {
                    margin: [0, $.auto, 2, $.rem], fontSize: $.rem(1.75), fontWeight: 600, textAlign: $.center, ...textGradient, display: $.flex, alignItems: $.center, justifyContent: $.center, gap: 12,
                    a: {
                        color: "inherit", textDecoration: $.none, display: $.flex, alignItems: $.center, gap: 12,
                        "&::before": { content: "''", display: $.inlineBlock, width: 32, height: 32, backgroundImage: "url('public/assets/logo.svg')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: $.center },
                    },
                },
            },
            ".search": {
                borderBottom: "unset", background: $.transparent, paddingLeft: 20, margin: $.important(0),
                input: { minWidth: $.percent(95), margin: [0, $.auto], backgroundColor: $.important(sidebarInputBg), color: $.important(sidebarInputColor), border: $.important({ color: sidebarInputBorder }) }
            },
            ".sidebar-nav": { lineHeight: $.em(2), padding: [0, 20, 40] },
            li: {
                margin: [4, 0],
                "&.collapse .app-sub-sidebar": { display: $.none },
                ">p": { fontWeight: 600, margin: 0, color: textPrimary }
            },
            ul: {
                margin: [0, 0, 0, 15], padding: 0, listStyle: $.none,
                li: {
                    a: {
                        borderBottom: { style: "none" }, display: $.block, color: textSecondary, fontSize: 14, fontWeight: 400, overflow: $.hidden, textDecoration: $.none, textOverflow: "ellipsis", whiteSpace: $.nowrap, padding: [4, 0], transition: [{ prop: "all", time: "0.15s" }], borderRadius: 4,
                        "&:hover": { color: themePrimary, paddingLeft: 8 },
                        "&.active": { ...$.important({ color: themePrimary, fontWeight: 600, background: $.linearGradient({ dir: 90, stops: [sidebarNavLinkConfigActive, $.transparent] }), borderLeft: { width: 4, color: themePrimary }, paddingLeft: 16 }) }
                    },
                    ul: { paddingLeft: 20 }
                }
            }
        },
        /** Desktop Sidebar Collapse Logic */
        "body.close": {
            ".sidebar": { transform: $.transform().translateX("-100%").str() },
            ".content": { marginLeft: 0, width: $.vw(100), maxWidth: $.vw(100) },
            ".sidebar-toggle": {
                width: 1, padding: 12, background: $.transparent, left: 0, cursor: $.pointer,
                "&::after": { content: $.text("Contenido"), pointerEvents: $.auto }
            },
            ".markdown-section": { padding: [20, 20, 60] }
        },
        ".sidebar-toggle": {
            background: sidebarToggleBg, backdropFilter: [$.blur(10)], border: 0, borderBottom: { color: sidebarToggleBorder }, outline: $.none, padding: [12, 12, 12, 16], position: $.sticky, top: 0, textAlign: $.center, transition: [{ prop: "opacity", time: transitionBase }], width: SIDEBAR_WIDTH, marginRight: $.calc($.sub($.px(0), SIDEBAR_WIDTH)), zIndex: 30, cursor: $.pointer, display: $.flex, alignItems: $.center, justifyContent: $.flexStart,
            "&:hover .sidebar-toggle-button": { opacity: 1 },
            span: { background: themePrimary, display: $.block, marginBottom: 4, width: 16, height: 2, borderRadius: 1, transition: [{ prop: "all", time: "0.15s" }] },
            "&::after": { content: "'Documentación'", marginLeft: 12, fontSize: 14, fontWeight: 600, color: themePrimary, letterSpacing: "0.05em", pointerEvents: "none" }
        },
        ".content": { paddingTop: 60, position: $.relative, flexGrow: 1, minWidth: 0, minHeight: $.vh(100), transition: [{ prop: "margin-left", time: "0.25s", ease: $.cubicBezier(0.4, 0, 0.2, 1) }] },
        ".app-nav": {
            margin: [25, 60, 0, 0], position: $.absolute, right: 0, textAlign: $.right, zIndex: 10,
            "&.no-badge": { marginRight: 25 },
            p: { margin: 0 },
            ">a": { margin: [0, 1, $.rem], padding: [5, 0] },
            "ul, li": { display: $.inlineBlock, listStyle: $.none, margin: 0 },
            a: {
                color: textSecondary, fontSize: 15, fontWeight: 500, textDecoration: $.none, transition: [{ prop: "color", time: transitionBase }],
                "&:hover": { color: themePrimary },
                "&.active": { color: themePrimary, borderBottom: { width: 2, color: themePrimary } }
            },
            li: {
                display: $.inlineBlock, margin: [0, 1, $.rem], padding: [5, 0], position: $.relative, cursor: $.pointer,
                ul: {
                    background: bgPrimary, border: { color: borderColor }, borderRadius: 8, boxShadow: { dY: 4, blur: 16, color: shadowColorMd }, display: $.none, maxHeight: $.calc($.sub($.vh(100), 61)), overflowY: $.auto, padding: [10, 0], position: $.absolute, right: -15, textAlign: $.left, top: $.percent(100), whiteSpace: $.nowrap, backdropFilter: [$.blur(10)],
                    li: {
                        display: $.block, fontSize: 14, lineHeight: $.rem(1), margin: [8, 14], whiteSpace: $.nowrap,
                        a: {
                            display: $.block, fontSize: $.inherit, margin: 0, padding: 0,
                            "&.active": { borderBottom: 0 }
                        }
                    }
                },
                "&:hover ul": { display: $.block }
            }
        },
        /** Footer / Creator Info Styles */
        ".app-footer": {
            position: $.fixed, bottom: 10, right: 10, zIndex: 100, display: $.flex, alignItems: "stretch", gap: 10, padding: [6, 12], borderRadius: 16, background: footerBg, backdropFilter: [$.blur(5)], border: { color: footerBorder }, transition: [{ prop: "all", time: "300ms" }],
            "&:hover": { background: footerBgHover, borderColor: footerBorderHover }
        },
        ".creator-info": { fontSize: "0.75rem", color: creatorInfoColor, fontFamily: $.fontFamily("-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"), letterSpacing: "0.05em", fontWeight: 500, display: $.flex, alignItems: "center" },
        ".social-links": { display: $.flex, gap: 6 },
        ".social-btn": {
            width: 32, height: 32, cursor: $.pointer, padding: 0, background: socialBtnBg, borderRadius: $.percent(50), display: $.flex, alignItems: $.center, justifyContent: $.center, color: socialBtnColor, textDecoration: $.none, fontSize: 14, fontWeight: 700, transition: [{ prop: "all", time: "300ms", ease: $.cubicBezier(0.4, 0, 0.2, 1) }], border: { color: socialBtnBorder },
            "&:hover": { background: themePrimary, color: "white", transform: $.transform().translateY(-2).str(), boxShadow: { dY: 4, blur: 12, color: socialBtnHoverShadow }, borderColor: $.transparent },
            i: { lineHeight: $.unset }
        },
        ...$.ltw(768, {
            body: {
                vars: { isBigW: 0 },
            },
            ".app-nav": {
                marginTop: 16,
                "li ul": { top: 30 }
            },
            main: { height: $.auto, minHeight: $.vh(100), overflowX: $.hidden },
            ".content": { left: 0, maxWidth: $.vw(100), paddingTop: 20, transition: [{ prop: "transform", time: "250ms" }] },
            ".github-corner, .sidebar-toggle, .sidebar": { position: $.important($.fixed) },
            body: {
                overflow: "hidden",
                ".input-wrap input": { width: $.percent(100) },
                ".app-nav, .github-corner": { transition: [{ prop: "transform", time: "250ms", ease: "ease-out" }] },
                ".sidebar": { width: sidebarWidthMobile, paddingTop: 60, transition: [{ prop: "transform", time: "250ms", ease: "ease-out" }] },
                ".sidebar-toggle": { width: sidebarWidthMobile, backdropFilter: [$.blur(10)], border: 0, borderBottom: { color: borderColor }, outline: $.none, padding: 12, position: $.sticky, top: 0, left: 0 },
                "&:is(.close)": {
                    ".sidebar": { transform: $.transform().translateX(0).str() },
                    ".sidebar-toggle": { width: $.important(150), transition: [{ prop: "background-color", time: "1s" }], padding: 10 },
                    ".content": { transform: $.transform().translateX(0).str() },
                    ".app-nav, .github-corner": { display: $.none }
                }
            },
            ".github-corner": {
                "&:hover .octo-arm": { animation: $.none },
                ".octo-arm": { animation: [{ name: "octocat-wave", duration: "560ms", timing: "ease-in-out" }] }
            },
            ".markdown-section": { padding: [20, 16, 40] },
            "section.cover h1": { fontSize: $.rem(2.5) }
        }, {
            ".input-wrap input": { width: $.important("auto") }
        }),
        "@media print": {
            ".sidebar, .app-nav, .github-corner, .sidebar-toggle": { display: $.none },
            ".content": { padding: 0, margin: 0, width: $.percent(100) },
            a: { textDecoration: "underline", color: "black" }
        }
    })
    StyleSingleton.add("fluid-tabs-style", {
        '.fluid-tabs': {
            border: { color: tabsBorder }, borderRadius: 6, overflow: 'hidden', marginBottom: 20, backgroundColor: tabsBg,
            '&-header': { display: 'flex', backgroundColor: tabsHeaderBg, borderBottom: { color: tabsBorder } },
            '&-content': { padding: 20 }
        },
        '.fluid-tab-btn': {
            padding: [10, 20], background: 'transparent', border: { style: "none" }, color: tabsBtnText, cursor: 'pointer', borderRight: { color: tabsBorder }, fontSize: 14, fontWeight: 600, transition: transitionAll("0.2s"),
            '&:hover': { color: tabsBtnTextHover, backgroundColor: tabsBtnBgHover },
            '&.active': { color: tabsActive, backgroundColor: tabsBg, borderBottom: { width: 2, color: tabsActive }, marginBottom: -1 }
        },
        '.fluid-tab-panel': {
            display: 'none',
            '&.active': { display: 'block', animation: 'fadeIn 0.3s ease', padding: "10px" }
        },
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: $.transform().translateY(5).str() },
            to: { opacity: 1, transform: $.transform().translateY(0).str() }
        }
    })

    StyleSingleton.add("latex-style", $ => ({
        ".latex-img": { filter: [$.invert(0.5), $.sepia(1), $.hueRotate(180)], display: $.block, margin: [1, $.auto, $.rem], maxWidth: $.percent(100) }
    }))
})()
