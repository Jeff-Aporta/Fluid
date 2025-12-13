// @ts-nocheck
$ => ({
    initheader: "@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap\");",
    ":root": {
        vars: { themePrimary: "#00AEEF", themePrimaryLight: "#33C1F3", themePrimaryDark: "#0090C7", themeSecondary: "#2c3e50", themeAccent: "#42b983", bgPrimary: $.rgba(149, 186, 255, 0.2), bgSecondary: $.rgba(128, 0.1), bgCode: "#1e293b", textPrimary: "#5a9bdd", textSecondary: "#86a5c3", textMuted: "#8492a6", borderColor: "#e4e7ed", shadowSm: { dY: 2, blur: 8, color: $.rgba(0, 0.08) }, shadowMd: { dY: 4, blur: 16, color: $.rgba(0, 0.12) }, shadowlg: { dY: 8, blur: 24, color: $.rgba(0, 0.15) }, radiusSm: 4, radiusMd: 8, radiusLg: 12, transitionFast: "0.15s ease", transitionBase: "0.3s ease", bgCodeTransparent: $.transparent }
    },
    code: {
        vars: { bgCode: $.cssVar("bg-code-transparent") }
    },
    "*": {
        webkitFontSmoothing: $.antialiased, "-moz-osx-font-smoothing": "grayscale", webkitOverflowScrolling: $.touch, webkitTapHighlightColor: $.transparent, webkitTextSizeAdjust: $.none, webkitTouchCallout: $.none, boxSizing: "border-box",
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-track": { background: $.rgb(19, 19, 52) },
        "&::-webkit-scrollbar-thumb": { background: $.rgb(19, 19, 52), borderRadius: 4, transition: [{ prop: "background", time: $.cssVar("transition-base") }] },
        "&:hover::-webkit-scrollbar-thumb": {
            background: $.rgba(0, 174, 239, 0.2),
            "&:hover": { background: $.rgba(0, 174, 239, 0.4) }
        },
        "&:hover::-webkit-scrollbar-track": { background: "midnightblue" }
    },
    "html, body": { minHeight: $.percent(100), margin: 0, padding: 0 },
    ".cover, .cover-main, mask": { ...$.important({ background: $.background($.radialGradient({ shape: "ellipse 120% 80%", at: { x: "70%", y: "20%" }, stops: [[$.rgba(255, 20, 147, 0.15), 0], [$.transparent, 50]] }), $.radialGradient({ shape: "ellipse 100% 60%", at: { x: "30%", y: "10%" }, stops: [[$.rgba(0, 255, 255, 0.12), 0], [$.transparent, 60]] }), $.radialGradient({ shape: "ellipse 90% 70%", at: { x: "50%", y: "0%" }, stops: [[$.rgba(138, 43, 226, 0.18), 0], [$.transparent, 65]] }), $.radialGradient({ shape: "ellipse 110% 50%", at: { x: "80%", y: "30%" }, stops: [[$.rgba(255, 215, 0, 0.08), 0], [$.transparent, 40]] }), "#000000"), margin: 0, minHeight: $.vh(100) }) },
    body: {
        fontFamily: $.fontFamily("Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"), fontSize: 15, lineHeight: 1.6, color: $.cssVar("text-primary"), overflowX: $.hidden, position: $.relative, ...$.important({ backgroundColor: $.cssVar("bg-primary") }),
        "&:not(.ready)": {
            overflow: $.hidden,
            "[data-cloak], .app-nav, >nav": { display: $.none }
        },
        "&.close": {
            ".sidebar": { marginLeft: $.calc($.sub($.px(0), $.max($.percent(30), 400))) },
            ".sidebar-toggle": { width: $.auto, marginRight: 0 },
            ".content": {}
        },
        "&::before": { content: $.text(""), position: $.fixed, inset: 0, zIndex: -1, background: $.background($.radialGradient({ shape: "ellipse 120% 80%", at: { x: "70%", y: "20%" }, stops: [[$.rgba(255, 20, 147, 0.15), 0], [$.transparent, 50]] }), $.radialGradient({ shape: "ellipse 100% 60%", at: { x: "30%", y: "10%" }, stops: [[$.rgba(0, 255, 255, 0.12), 0], [$.transparent, 60]] }), $.radialGradient({ shape: "ellipse 90% 70%", at: { x: "50%", y: "0%" }, stops: [[$.rgba(138, 43, 226, 0.18), 0], [$.transparent, 65]] }), $.radialGradient({ shape: "ellipse 110% 50%", at: { x: "80%", y: "30%" }, stops: [[$.rgba(255, 215, 0, 0.08), 0], [$.transparent, 40]] }), "#000000") }
    },
    "#app": {
        fontSize: 28, fontWeight: 300, margin: [40, $.auto], textAlign: $.center, color: $.cssVar("theme-primary"),
        "&:empty::before": { content: "'Cargando...'" }
    },
    ".progress": { left: 0, position: $.fixed, right: 0, top: 0, width: $.percent(0), zIndex: 999999, transition: [{ prop: "width", time: $.cssVar("transition-base") }, { prop: "opacity", time: "0.4s" }], ...$.important({ background: $.linearGradient({ dir: "to right", stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }), height: 4, boxShadow: { blur: 15, color: $.cssVar("theme-primary") } }) },
    "section.cover": {
        position: $.relative, alignItems: $.center, justifyContent: $.center, backgroundPosition: $.center, backgroundRepeat: "no-repeat", backgroundSize: "cover", minHeight: $.vh(100), width: $.percent(100), display: $.none, ...$.important({ background: $.linearGradient({ dir: 135, stops: [$.transparent, [$.rgba(95, 30, 85, 0.3), 100]] }) }),
        "&.show": { display: $.flex },
        "&.has-mask .mask": { background: $.linearGradient({ dir: "to bottom", stops: [$.transparent, [$.rgba(10, 22, 40, 0.5), 50], ["#0a1628", 95]] }), position: $.absolute, top: 0, bottom: 0, width: $.percent(100) },
        ".cover-main": {
            flex: 1, margin: [0, 16], textAlign: $.center, position: $.relative, zIndex: 1,
            ">p:last-child a": {
                border: { width: 2, color: $.cssVar("theme-primary") }, borderRadius: 50, color: $.cssVar("theme-primary"), display: $.inlineBlock, fontSize: $.rem(1.05), fontWeight: 600, letterSpacing: $.em(0.05), margin: [10, 0], padding: [5, 25], textDecoration: $.none, transition: [{ prop: "all", time: $.cssVar("transition-base") }], boxShadow: { dY: 4, blur: 12, color: $.rgba(0, 174, 239, 0.2) },
                "&:hover": { transform: $.transform().translateY(-2).str(), boxShadow: { dY: 8, blur: 20, color: $.rgba(0, 174, 239, 0.3) } },
                "&:last-child": {
                    background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }), color: "white", borderColor: $.transparent,
                    "&:hover": { boxShadow: { dY: 8, blur: 24, color: $.rgba(0, 174, 239, 0.4) } }
                }
            }
        },
        a: {
            color: $.inherit, textDecoration: $.none,
            "&:hover": { textDecoration: $.none }
        },
        p: { lineHeight: 1.8, margin: 0, color: $.cssVar("text-secondary"), fontSize: $.rem(1.1) },
        h1: {
            color: $.cssVar("theme-primary"), fontSize: $.rem(3.5), fontWeight: 700, margin: 0, position: $.relative, textAlign: $.center,
            a: { display: $.block, height: "fit-content" },
            small: { bottom: $.rem(-0.5), fontSize: $.rem(1.25), fontWeight: 400, position: $.absolute, color: $.cssVar("text-muted") }
        },
        blockquote: {
            fontSize: $.rem(1.5), textAlign: $.center, color: $.cssVar("text-secondary"), fontWeight: 300,
            ">p>a": {
                borderBottom: { width: 2, color: $.cssVar("theme-primary") }, transition: [{ prop: "color", time: $.cssVar("transition-base") }],
                "&:hover": { color: $.cssVar("theme-primary") }
            }
        },
        ul: { lineHeight: 2, listStyleType: $.none, margin: [2, $.auto, $.em], maxWidth: 500, padding: 0 },
        "img[alt='logo']": { width: 250, height: $.auto, objectFit: "cover" }
    },
    img: {
        maxWidth: $.percent(100),
        "&.emoji": { height: $.em(1.2), verticalAlign: "middle" }
    },
    span: {
        "&.emoji": { fontFamily: $.fontFamily("Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"), fontSize: $.em(1.2), verticalAlign: "middle" }
    },
    a: {
        "&[disabled]": { cursor: "not-allowed", opacity: 0.6 }
    },
    kbd: { background: $.cssVar("bg-code"), border: { color: $.cssVar("border-color") }, borderRadius: $.cssVar("radius-sm"), boxShadow: { dY: 1, color: $.rgba(0, 0.05) }, display: $.inlineBlock, fontSize: 12, fontFamily: $.fontFamily("Fira Code", "monospace"), lineHeight: 12, marginBottom: 3, padding: [4, 6], verticalAlign: "middle" },
    li: {
        "input[type='checkbox']": { margin: [0, 0.2, 0.25, 0], verticalAlign: "middle" }
    },
    ".medium-zoom-overlay": { ...$.important({ background: "#0f172a" }) },
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
    ".pulse text": { fontWeight: "bold", ...$.important({ fill: "#000" }) },
    ".code-editor": { display: $.none },
    ".CodeMirror": { backgroundColor: $.rgb(14, 14, 36), color: "#d6deeb", border: { color: $.rgba(255, 0.1) }, borderRadius: 8, fontFamily: $.fontFamily("Consolas", "Monaco", "Courier New", "monospace"), fontSize: $.em(0.95), height: $.auto, minHeight: 100, maxWidth: $.percent(90), margin: [20, $.auto], boxShadow: { dY: 10, blur: 30, color: $.rgba(0, 0.3) } },
    ".CodeMirror-gutters": { backgroundColor: $.rgb(14, 14, 36), borderRight: { color: $.rgba(255, 0.05) } },
    ".CodeMirror-linenumber": { color: "#4b6479" },
    ".CodeMirror-cursor": { borderLeft: { color: "#80a4c2" } },
    ".CodeMirror-selected": { ...$.important({ background: $.rgba(29, 59, 83, 0.5) }) },
    ".CodeMirror-focused .CodeMirror-selected": { ...$.important({ background: $.rgba(29, 59, 83, 0.5) }) },
    ".cm-s-vscode-dark": {
        "span.cm-keyword": { fontStyle: "italic", ...$.important({ color: "#c792ea" }) },
        "span.cm-atom, span.cm-number": { ...$.important({ color: "#f78c6c" }) },
        "span.cm-def": { ...$.important({ color: "#82aaff" }) },
        "span.cm-variable": { ...$.important({ color: "#d6deeb" }) },
        "span.cm-variable-2": { ...$.important({ color: "#addb67" }) },
        "span.cm-variable-3": { ...$.important({ color: "#7fdbca" }) },
        "span.cm-property": { ...$.important({ color: "#80cbc4" }) },
        "span.cm-string": { ...$.important({ color: "#ecc48d" }) },
        "span.cm-comment": { fontStyle: "italic", ...$.important({ color: "#637777" }) },
        "span.cm-tag": { ...$.important({ color: "#7fdbca" }) },
        "span.cm-attribute": { ...$.important({ color: "#addb67" }) },
        "span.cm-operator": { ...$.important({ color: "#c792ea" }) },
        "span.cm-meta": { ...$.important({ color: "#82aaff" }) },
        "span.cm-builtin": { ...$.important({ color: "#82aaff" }) }
    },
    ".CodeMirror-scroll": {
        "::-webkit-scrollbar": { width: 8, height: 8 },
        "::-webkit-scrollbar-track": { background: $.transparent },
        "::-webkit-scrollbar-thumb": {
            background: $.rgba(255, 0.1), borderRadius: 4, transition: [{ prop: "background", time: "0.2s" }],
            "&:hover": { background: $.rgba(255, 0.2) }
        }
    },
    ".CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler": { backgroundColor: $.rgb(14, 14, 36) },
    ".mermaid": {
        svg: { display: $.block, margin: [0, $.auto] }
    },
    ".graphviz-wrapper": {
        display: $.flex, alignItems: $.center, justifyContent: $.center, background: $.cssVar("bg-code"), position: $.relative, border: { color: $.cssVar("border-color") }, borderRadius: $.cssVar("radius-md"), boxShadow: $.cssVar("shadow-sm"), margin: [1.5, 0, $.em], padding: 20, overflow: $.hidden,
        img: { maxWidth: $.percent(90), maxHeight: $.percent(90), filter: [$.contrast(1.05)] }
    },
    ".markdown-section": {
        margin: [0, $.auto], maxWidth: 900, padding: [30, 10, 30, "clamp(0px,", 60, "+", "(0 - 60)", "*", "((var(--window-width, 100vw) - 770px)", "/", "(1400 - 770)), 60px)"], position: $.relative,
        ">*": { boxSizing: "border-box", fontSize: $.inherit },
        "> :first-child": { ...$.important({ marginTop: 0 }) },
        "h1, h2, h3, h4, h5, h6": {
            color: $.cssVar("text-primary"), fontWeight: 600, position: $.relative,
            "&:hover .anchor": { opacity: 1 }
        },
        h1: { fontSize: $.rem(2.5), margin: [0, 0, 2, $.rem], fontWeight: 700, background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }), webkitBackgroundClip: "text", webkitTextFillColor: $.transparent, backgroundClip: "text" },
        h2: { fontSize: $.rem(2), margin: [3, 0, 1.5, $.rem], paddingBottom: $.rem(0.5), borderBottom: { width: 2, color: $.cssVar("border-color") } },
        h3: { fontSize: $.rem(1.5), margin: [2.5, 0, 1, $.rem] },
        h4: { fontSize: $.rem(1.25), margin: [2, 0, 0.8, $.rem] },
        "h5, h6": { fontSize: $.rem(1), color: $.cssVar("text-secondary") },
        a: {
            color: $.cssVar("theme-primary"), fontWeight: 500, textDecoration: $.none, borderBottom: { color: $.transparent }, transition: [{ prop: "all", time: $.cssVar("transition-fast") }],
            "&:hover": { borderBottomColor: $.cssVar("theme-primary") }
        },
        "p, ul, ol": { lineHeight: 1.8, margin: [1.5, 0, $.em], color: $.cssVar("text-secondary") },
        "ul, ol": { paddingLeft: $.rem(1.5) },
        blockquote: {
            background: $.linearGradient({ dir: 90, stops: [$.rgba(0, 174, 239, 0.05), $.transparent] }), borderLeft: { width: 4, color: $.cssVar("theme-primary") }, color: $.cssVar("text-secondary"), margin: [2, 0, $.em], padding: [1, 1.5, $.rem], borderRadius: $.joinSpace(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0),
            p: {
                fontWeight: 500, margin: [0.5, 0, $.em], color: $.cssVar("text-primary"),
                "&:first-child": { marginTop: 0 },
                "&:last-child": { marginBottom: 0 }
            }
        },
        pre: {
            background: $.cssVar("bg-code"), borderRadius: $.cssVar("radius-md"), margin: [1.5, 0, $.em], padding: [1.5, $.rem], overflowX: $.auto, position: $.relative, boxShadow: $.cssVar("shadow-sm"),
            ">code": { background: $.none, color: $.cssVar("text-primary"), fontSize: $.rem(0.875), padding: 0, lineHeight: 1.6, display: $.block },
            "&::after": { content: "attr(data-lang)", position: $.absolute, top: $.rem(0.5), right: $.rem(1), color: $.cssVar("text-muted"), fontSize: $.rem(0.75), fontWeight: 600, textTransform: $.uppercase, letterSpacing: $.em(0.05) }
        },
        table: {
            borderCollapse: "collapse", borderSpacing: 0, display: $.block, margin: [2, 0, $.rem], overflow: $.auto, width: $.percent(100), borderRadius: $.cssVar("radius-md"), boxShadow: $.cssVar("shadow-sm"), border: { color: $.cssVar("border-color") }, backgroundColor: $.rgba(0, 0.5),
            th: { background: $.rgb(21, 21, 69), border: { color: $.cssVar("border-color") }, fontWeight: 600, padding: [12, 16], color: $.cssVar("text-primary") },
            td: { border: { color: $.cssVar("border-color") }, padding: [12, 16], color: $.cssVar("text-secondary") },
            tr: {
                "&:nth-child(2n)": { background: $.cssVar("bg-secondary") },
                "&:hover": { background: $.rgba(0, 174, 239, 0.05) }
            }
        },
        hr: { border: { style: "none" }, borderTop: { width: 2, color: $.cssVar("border-color") }, margin: [3, 0, $.em] },
        "p.tip": {
            background: $.linearGradient({ dir: 90, stops: [$.rgba(255, 102, 102, 0.1), $.transparent] }), borderLeft: { width: 4, color: "#f66" }, borderRadius: $.joinSpace(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0), margin: [2, 0, $.em], padding: [1, 1.5, 1, 3, $.rem], position: $.relative,
            "&::before": { content: "'!'", position: $.absolute, left: $.rem(1), top: $.rem(1), background: "#f66", color: "white", width: 24, height: 24, borderRadius: $.percent(50), display: $.flex, alignItems: $.center, justifyContent: $.center, fontWeight: 700, fontSize: 14 },
            code: { background: $.rgba(255, 102, 102, 0.1) }
        },
        "p.warn": { background: $.linearGradient({ dir: 90, stops: [$.rgba(66, 185, 131, 0.1), $.transparent] }), borderLeft: { width: 4, color: $.cssVar("theme-accent") }, borderRadius: $.joinSpace(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0), padding: [1, 1.5, $.rem] },
        "ul.task-list>li": { listStyleType: $.none }
    },
    ".anchor": {
        display: $.inlineBlock, textDecoration: $.none, transition: [{ prop: "opacity", time: $.cssVar("transition-base") }], marginLeft: $.rem(0.5),
        "&:not(:is(a))": { opacity: 0 },
        span: { color: $.cssVar("theme-primary") },
        "&:hover": { textDecoration: $.none }
    },
    ".github-corner": {
        borderBottom: 0, position: $.fixed, right: 0, textDecoration: $.none, top: 0, zIndex: 1, transition: [{ prop: "transform", time: $.cssVar("transition-base") }],
        "&:hover": {
            transform: $.transform().scale(1.05).str(),
            ".octo-arm": { animation: [{ name: "octocat-wave", duration: "560ms", timing: "ease-in-out" }] }
        },
        svg: { color: "white", fill: $.cssVar("theme-primary"), height: 80, width: 80 }
    },
    "@keyframes octocat-wave": {
        "0%, 100%": { transform: $.transform().rotate($.deg(0)).str() },
        "20%, 60%": { transform: $.transform().rotate($.deg(-25)).str() },
        "40%, 80%": { transform: $.transform().rotate($.deg(10)).str() }
    },
    ".app-sub-sidebar": {
        "li::before": { content: "'→'", paddingRight: 6, float: $.left, color: $.cssVar("theme-primary"), fontWeight: 600 }
    },
    ".token": {
        "&.comment, &.prolog, &.doctype, &.cdata": { color: "#8e908c" },
        "&.namespace": { opacity: 0.7 },
        "&.boolean, &.number": { color: "#0099CC" },
        "&.punctuation": { color: "#525252" },
        "&.property": { color: "#0088BB" },
        "&.tag": { color: "#0066CC" },
        "&.string": { color: $.cssVar("theme-primary") },
        "&.selector": { color: "#5599FF" },
        "&.attr-name": { color: "#0066CC" },
        "&.entity, &.url": { color: "#00AEEF" },
        "&.attr-value, &.control, &.directive, &.unit": { color: $.cssVar("theme-primary") },
        "&.keyword, &.function": { color: "#1E90FF" },
        "&.statement, &.regex, &.atrule": { color: "#00AEEF" },
        "&.placeholder, &.variable": { color: "#4DA6FF" },
        "&.deleted": { textDecoration: "line-through" },
        "&.inserted": { borderBottom: { style: "dotted", color: "#202746" }, textDecoration: $.none },
        "&.italic": { fontStyle: "italic" },
        "&.important, &.bold": { fontWeight: "bold" },
        "&.important": { color: "#FF6B6B" },
        "&.entity": { cursor: "help" }
    },
    ".insoft-logo-corner": {
        top: 0, right: 10, width: 150, height: $.auto, zIndex: 100, filter: [$.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" }), $.dropShadow({ blur: 0.4, color: "white" })],
        vars: { br: 0.4 }
    },
    "@media print": {
        ".sidebar, .app-nav, .github-corner, .sidebar-toggle": { display: $.none },
        ".content": { padding: 0, margin: 0, width: $.percent(100) },
        a: { textDecoration: "underline", color: "black" }
    },
    main: {
        display: $.flex, alignItems: $.flexStart, position: $.relative, width: $.vw(100), zIndex: 0,
        "&.hidden": { display: $.none }
    },
    ".sidebar": {
        background: $.rgb(14, 14, 36), overflowY: $.auto, padding: 0, position: $.sticky, top: 0, left: 0, height: $.vh(100), flexShrink: 0, transition: [{ prop: "margin-left", time: "250ms", ease: $.cubicBezier(0.4, 0, 0.2, 1) }], width: $.max($.percent(30), 400), zIndex: 20,
        ".sidebar-header": {
            width: $.percent(100), zIndex: 25, background: $.rgb(21, 21, 58), paddingTop: 60, paddingBottom: 10,
            ".app-name": {
                margin: 0, padding: 0, textAlign: $.center,
                "&, :visited, :link, :hover, :active": { color: $.cssVar("text-primary"), textDecoration: $.unset }
            }
        },
        ".search": {
            borderBottom: { color: $.unset }, background: $.transparent, paddingLeft: 20, ...$.important({ margin: 0 }),
            input: { ...$.important({ backgroundColor: "#333", color: "#fff", border: { color: "#555" } }) }
        },
        ">h1": {
            margin: [0, $.auto, 2, $.rem], fontSize: $.rem(1.75), fontWeight: 600, textAlign: $.center, background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }), webkitBackgroundClip: "text", webkitTextFillColor: $.transparent, backgroundClip: "text", display: $.flex, alignItems: $.center, justifyContent: $.center, gap: 12,
            "&::before": { content: $.text(""), display: $.inlineBlock, width: 32, height: 32, backgroundImage: $.url("public/assets/logo.svg"), backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: $.center },
            a: { color: $.inherit, textDecoration: $.none },
            ".app-nav": { display: $.block, position: $.static }
        },
        ".sidebar-nav": { lineHeight: $.em(2), padding: [0, 20, 40] },
        li: {
            margin: [4, 0],
            "&.collapse .app-sub-sidebar": { display: $.none },
            ">p": { fontWeight: 600, margin: 0, color: $.cssVar("text-primary") }
        },
        ul: {
            margin: [0, 0, 0, 15], padding: 0, listStyle: $.none,
            li: {
                a: {
                    borderBottom: { style: "none" }, display: $.block, color: $.cssVar("text-secondary"), fontSize: 14, fontWeight: 400, overflow: $.hidden, textDecoration: $.none, textOverflow: "ellipsis", whiteSpace: $.nowrap, padding: [4, 0], transition: [{ prop: "all", time: $.cssVar("transition-fast") }], borderRadius: $.cssVar("radius-sm"),
                    "&:hover": { color: $.cssVar("theme-primary"), paddingLeft: 8 },
                    "&.active": { ...$.important({ color: $.cssVar("theme-primary"), fontWeight: 600, background: $.linearGradient({ dir: 90, stops: [$.rgba(0, 174, 239, 0.15), $.transparent] }), borderLeft: { width: 4, color: $.cssVar("theme-primary") }, paddingLeft: 16 }) }
                },
                ul: { paddingLeft: 20 }
            }
        }
    },
    "body.close": {
        ".sidebar": { transform: $.transform().translateX($.percent(-100)).str() },
        ".content": { marginLeft: 0, width: $.vw(100), maxWidth: $.vw(100) },
        ".sidebar-toggle": {
            width: 1, padding: 12, background: $.transparent, left: 0, cursor: $.pointer,
            "&::after": { content: "'Contenido'", pointerEvents: $.auto }
        },
        ".markdown-section": { padding: [20, 20, 60] }
    },
    ".sidebar-toggle": {
        background: $.rgb(19, 19, 52), backdropFilter: [$.blur(10)], border: 0, borderBottom: { color: $.rgba(128, 0.5) }, outline: $.none, padding: [12, 12, 12, 16], position: $.sticky, top: 0, textAlign: $.center, transition: [{ prop: "opacity", time: $.cssVar("transition-base") }], width: $.max($.percent(30), 400), marginRight: $.calc($.sub($.px(0), $.max($.percent(30), 400))), zIndex: 30, cursor: $.pointer, display: $.flex, alignItems: $.center, justifyContent: $.flexStart,
        "&:hover .sidebar-toggle-button": { opacity: 1 },
        span: { background: $.cssVar("theme-primary"), display: $.block, marginBottom: 4, width: 16, height: 2, borderRadius: 1, transition: [{ prop: "all", time: $.cssVar("transition-fast") }] },
        "&::after": { content: "'Documentación'", marginLeft: 12, fontSize: 14, fontWeight: 600, color: $.cssVar("theme-primary"), letterSpacing: $.em(0.05), pointerEvents: $.none }
    },
    ".content": { paddingTop: 60, position: $.relative, flexGrow: 1, minWidth: 0, minHeight: $.vh(100), transition: [{ prop: "margin-left", time: "0.25s", ease: $.cubicBezier(0.4, 0, 0.2, 1) }] },
    ".app-nav": {
        margin: [25, 60, 0, 0], position: $.absolute, right: 0, textAlign: $.right, zIndex: 10,
        "&.no-badge": { marginRight: 25 },
        p: { margin: 0 },
        ">a": { margin: [0, 1, $.rem], padding: [5, 0] },
        "ul, li": { display: $.inlineBlock, listStyle: $.none, margin: 0 },
        a: {
            color: $.cssVar("text-secondary"), fontSize: 15, fontWeight: 500, textDecoration: $.none, transition: [{ prop: "color", time: $.cssVar("transition-base") }],
            "&:hover": { color: $.cssVar("theme-primary") },
            "&.active": { color: $.cssVar("theme-primary"), borderBottom: { width: 2, color: $.cssVar("theme-primary") } }
        },
        li: {
            display: $.inlineBlock, margin: [0, 1, $.rem], padding: [5, 0], position: $.relative, cursor: $.pointer,
            ul: {
                background: $.cssVar("bg-primary"), border: { color: $.cssVar("border-color") }, borderRadius: $.cssVar("radius-md"), boxShadow: $.cssVar("shadow-md"), display: $.none, maxHeight: $.calc($.sub($.vh(100), 61)), overflowY: $.auto, padding: [10, 0], position: $.absolute, right: -15, textAlign: $.left, top: $.percent(100), whiteSpace: $.nowrap, backdropFilter: [$.blur(10)],
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
    ".app-footer": {
        position: $.fixed, bottom: 10, right: 10, zIndex: 100, display: $.flex, alignItems: "stretch", gap: 10, padding: [6, 12], borderRadius: 16, background: $.rgba(0, 0.2), backdropFilter: [$.blur(5)], border: { color: $.rgba(255, 0.05) }, transition: [{ prop: "all", time: "300ms" }],
        "&:hover": { background: $.rgba(0, 0.4), borderColor: $.rgba(255, 0.1) }
    },
    ".creator-info": { fontSize: $.rem(0.75), color: $.rgba(255, 0.5), fontFamily: $.fontFamily("-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"), letterSpacing: $.em(0.05), fontWeight: 500, display: $.flex, alignItems: $.center },
    ".social-links": { display: $.flex, gap: 6 },
    ".social-btn": {
        padding: 3, background: $.rgba(255, 0.05), borderRadius: $.percent(50), display: $.flex, alignItems: $.center, justifyContent: $.center, color: $.rgba(255, 0.6), textDecoration: $.none, fontSize: 9, fontWeight: 700, aspectRatio: $.joinSpace(1, "/", 1), transition: [{ prop: "all", time: "300ms", ease: $.cubicBezier(0.4, 0, 0.2, 1) }], border: { color: $.rgba(255, 0.05) },
        "&:hover": { background: $.cssVar("theme-primary"), color: "white", transform: $.transform().translateY(-2).str(), boxShadow: { dY: 4, blur: 12, color: $.rgba(0, 174, 239, 0.3) }, borderColor: $.transparent },
        i: { lineHeight: $.unset }
    },
    ...$.ltw(768, {
        ".app-nav": {
            marginTop: 16,
            "li ul": { top: 30 }
        },
        main: { height: $.auto, minHeight: $.vh(100), overflowX: $.hidden },
        ".content": { left: 0, maxWidth: $.vw(100), paddingTop: 20, transition: [{ prop: "transform", time: "250ms" }] },
        ".github-corner, .sidebar-toggle, .sidebar": { ...$.important({ position: $.fixed }) },
        body: {
            "&:not(.close)": {
                overflow: $.hidden,
                ".input-wrap input": { width: $.percent(100) },
                ".app-nav, .github-corner": { transition: [{ prop: "transform", time: "250ms", ease: "ease-out" }] },
                ".sidebar": { paddingTop: 60, transition: [{ prop: "transform", time: "250ms", ease: "ease-out" }], ...$.important({ width: $.vw(90) }) },
                ".sidebar-toggle": { backdropFilter: [$.blur(10)], border: 0, borderBottom: { color: $.cssVar("border-color") }, outline: $.none, padding: 12, position: $.sticky, top: 0, left: 0, ...$.important({ width: $.vw(90) }) }
            },
            "&:is(.close)": {
                ".sidebar": { transform: $.transform().translateX(0).str() },
                ".sidebar-toggle": { transition: [{ prop: "background-color", time: "1s" }], padding: 10, ...$.important({ width: 150 }) },
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
        ".input-wrap input": { ...$.important({ width: $.auto }) }
    }),
    ".medium-zoom-image.medium-zoom-image--opened": {
        ...$.important({ position: $.fixed, left: $.vw(5), top: $.vh(5), height: $.vh(90), width: $.vw(90), transform: $.unset, transformOrigin: $.unset })
    }
})