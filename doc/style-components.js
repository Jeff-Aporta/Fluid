/** 1. Imports y Configuración Global */
(() => {
    const { StyleSingleton } = window.FluidUI

    /** 2. Estilos de Componentes */
    StyleSingleton.add("doc-styles-components", /** @param {import('../src/CSS/types').THelpers} $ */ $ => ({
        ".mermaid": { "svg": { display: $.block, margin: $.margin(0, $.auto) } },
        ".graphviz-wrapper": {
            display: $.flex, alignItems: $.center, justifyContent: $.center, background: $.cssVar("bg-code"), /** Using theme variable instead of hardcoded #151e2e */
            position: $.relative, border: $.border({ width: 1, color: $.cssVar("border-color") }), borderRadius: $.cssVar("radius-md"), boxShadow: $.cssVar("shadow-sm"),
            margin: $.margin("1.5em", 0), padding: $.padding(20), overflow: $.hidden,
            "img": { maxWidth: $.percent(90), maxHeight: $.percent(90), filter: "contrast(1.05)" }
        },
        ".markdown-section": {
            margin: $.margin(0, $.auto), maxWidth: 900, padding: $.padding(30, 40, 60), position: $.relative,
            ">*": { boxSizing: $.borderBox, fontSize: "inherit" }, "> :first-child": { marginTop: $.important(0) },
            "h1, h2, h3, h4, h5, h6": { color: $.cssVar("text-primary"), fontWeight: 600, position: $.relative, "&:hover .anchor": { opacity: 1 } },
            "h1": {
                fontSize: "2.5rem", margin: $.margin(0, 0, "2rem"), fontWeight: 700, background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }),
                webkitBackgroundClip: "text", webkitTextFillColor: $.transparent, backgroundClip: "text"
            },
            "h2": { fontSize: "2rem", margin: $.margin("3rem", 0, "1.5rem"), paddingBottom: "0.5rem", borderBottom: $.border({ width: 2, color: $.cssVar("border-color") }) },
            "h3": { fontSize: "1.5rem", margin: $.margin("2.5rem", 0, "1rem") }, "h4": { fontSize: "1.25rem", margin: $.margin("2rem", 0, "0.8rem") }, "h5, h6": { fontSize: "1rem", color: $.cssVar("text-secondary") },
            "a": {
                color: $.cssVar("theme-primary"), fontWeight: 500, textDecoration: $.none, borderBottom: $.border({ width: 1, color: $.transparent }), transition: $.transition([{ prop: "all", time: $.cssVar("transition-fast") }]),
                "&:hover": { borderBottomColor: $.cssVar("theme-primary") }
            },
            "p, ul, ol": { lineHeight: 1.8, margin: $.margin("1.5em", 0), color: $.cssVar("text-secondary") }, "ul, ol": { paddingLeft: "1.5rem" },
            "blockquote": {
                background: $.linearGradient({ dir: 90, stops: [$.rgba(0, 174, 239, 0.05), $.transparent] }), borderLeft: $.border({ width: 4, color: $.cssVar("theme-primary") }), color: $.cssVar("text-secondary"), margin: $.margin("2em", 0), padding: $.padding("1rem", "1.5rem"), borderRadius: $.join(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0),
                "p": { fontWeight: 500, margin: $.margin("0.5em", 0), color: $.cssVar("text-primary"), "&:first-child": { marginTop: 0 }, "&:last-child": { marginBottom: 0 } }
            },
            "pre": {
                background: $.cssVar("bg-code"), borderRadius: $.cssVar("radius-md"), margin: $.margin("1.5em", 0), padding: "1.5rem", overflowX: $.auto, position: $.relative, boxShadow: $.cssVar("shadow-sm"),
                ">code": { background: $.none, color: $.cssVar("text-primary"), fontSize: "0.875rem", padding: 0, lineHeight: 1.6, display: $.block },
                "&::after": { content: "attr(data-lang)", position: $.absolute, top: "0.5rem", right: "1rem", color: $.cssVar("text-muted"), fontSize: "0.75rem", fontWeight: 600, textTransform: $.uppercase, letterSpacing: "0.05em" }
            },
            "table": {
                borderCollapse: "collapse", borderSpacing: 0, display: $.block, margin: $.margin("2rem", 0), overflow: $.auto, width: $.percent(100), borderRadius: $.cssVar("radius-md"), boxShadow: $.cssVar("shadow-sm"), border: $.border({ width: 1, color: $.cssVar("border-color") }), backgroundColor: $.rgba(0, 0, 0, 0.5),
                "th": { background: $.rgb(21, 21, 69), border: $.border({ width: 1, color: $.cssVar("border-color") }), fontWeight: 600, padding: $.padding(12, 16), color: $.cssVar("text-primary") },
                "td": { border: $.border({ width: 1, color: $.cssVar("border-color") }), padding: $.padding(12, 16), color: $.cssVar("text-secondary") },
                "tr": { "&:nth-child(2n)": { background: $.cssVar("bg-secondary") }, "&:hover": { background: $.rgba(0, 174, 239, 0.05) } }
            },
            "hr": { border: $.none, borderTop: $.border({ width: 2, color: $.cssVar("border-color") }), margin: $.margin("3em", 0) },
            "p.tip": {
                background: $.linearGradient({ dir: 90, stops: [$.rgba(255, 102, 102, 0.1), $.transparent] }), borderLeft: $.border({ width: 4, color: "#f66" }), borderRadius: $.join(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0), margin: $.margin("2em", 0), padding: $.padding("1rem", "1.5rem", "1rem", "3rem"), position: $.relative,
                "&::before": { content: "'!'", position: $.absolute, left: "1rem", top: "1rem", background: "#f66", color: "white", width: 24, height: 24, borderRadius: $.percent(50), display: $.flex, alignItems: $.center, justifyContent: $.center, fontWeight: 700, fontSize: 14 },
                "code": { background: $.rgba(255, 102, 102, 0.1) }
            },
            "p.warn": {
                background: $.linearGradient({ dir: 90, stops: [$.rgba(66, 185, 131, 0.1), $.transparent] }), borderLeft: $.border({ width: 4, color: $.cssVar("theme-accent") }), borderRadius: $.join(0, $.cssVar("radius-md"), $.cssVar("radius-md"), 0), padding: $.padding("1rem", "1.5rem")
            },
            "ul.task-list>li": { listStyleType: $.none }
        },
        ".anchor": {
            display: $.inlineBlock, textDecoration: $.none, "&:not(:is(a))": { opacity: 0 }, transition: $.transition([{ prop: "opacity", time: $.cssVar("transition-base") }]), marginLeft: "0.5rem", "span": { color: $.cssVar("theme-primary") }, "&:hover": { textDecoration: $.none }
        },
        "section.cover": {
            position: $.relative, alignItems: $.center, justifyContent: $.center, background: $.important($.linearGradient({ dir: 135, stops: [$.transparent, [$.rgba(95, 30, 85, 0.3), 100]] })), backgroundPosition: $.center, backgroundRepeat: "no-repeat", backgroundSize: "cover", minHeight: $.vh(100), width: $.percent(100), display: $.none,
            "&.show": { display: $.flex },
            "&.has-mask .mask": { background: $.linearGradient({ to: $.bottom, stops: [$.transparent, [$.rgba(10, 22, 40, 0.5), 50], ["#0a1628", 95]] }), position: $.absolute, top: 0, bottom: 0, width: $.percent(100) },
            ".cover-main": {
                flex: 1, margin: $.margin(0, 16), textAlign: $.center, position: $.relative, zIndex: 1,
                ">p:last-child a": {
                    border: $.border({ width: 2, color: $.cssVar("theme-primary") }), borderRadius: 50, color: $.cssVar("theme-primary"), display: $.inlineBlock, fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.05em", margin: $.margin(0.5, 1, $.rem), padding: $.padding("0.875em", "2.5rem"), textDecoration: $.none, transition: $.transition([{ prop: "all", time: $.cssVar("transition-base") }]), boxShadow: $.boxShadow({ dY: 4, blur: 12, color: $.rgba(0, 174, 239, 0.2) }),
                    "&:hover": { transform: $.transform().translateY(-2).str(), boxShadow: $.boxShadow({ dY: 8, blur: 20, color: $.rgba(0, 174, 239, 0.3) }) },
                    "&:last-child": { background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }), color: "white", borderColor: $.transparent, "&:hover": { boxShadow: $.boxShadow({ dY: 8, blur: 24, color: $.rgba(0, 174, 239, 0.4) }) } }
                }
            },
            "a": { color: "inherit", textDecoration: $.none, "&:hover": { textDecoration: $.none } }, "p": { lineHeight: 1.8, margin: $.margin("1.5em", 0), color: $.cssVar("text-secondary"), fontSize: "1.1rem" },
            "h1": { color: $.cssVar("theme-primary"), fontSize: "3.5rem", fontWeight: 700, margin: $.margin(1, 0, 2, $.rem), position: $.relative, textAlign: $.center, "a": { display: $.block }, "small": { bottom: "-0.5rem", fontSize: "1.25rem", fontWeight: 400, position: $.absolute, color: $.cssVar("text-muted") } },
            "blockquote": { fontSize: "1.5rem", textAlign: $.center, color: $.cssVar("text-secondary"), fontWeight: 300, ">p>a": { borderBottom: $.border({ width: 2, color: $.cssVar("theme-primary") }), transition: $.transition([{ prop: "color", time: $.cssVar("transition-base") }]), "&:hover": { color: $.cssVar("theme-primary") } } },
            "ul": { lineHeight: 2, listStyleType: $.none, margin: $.margin("2em", $.auto), maxWidth: 500, padding: 0 },
            "img[alt='logo']": { width: 300, height: $.auto, objectFit: "cover" }
        },
        ".github-corner": {
            borderBottom: 0, position: $.fixed, right: 0, textDecoration: $.none, top: 0, zIndex: 1, transition: $.transition([{ prop: "transform", time: $.cssVar("transition-base") }]),
            "&:hover": { transform: $.transform().scale(1.05).str(), ".octo-arm": { animation: "octocat-wave 560ms ease-in-out" } }, "svg": { color: "white", fill: $.cssVar("theme-primary"), height: 80, width: 80 }
        },
        "@keyframes octocat-wave": { "0%, 100%": { transform: $.transform().rotate(0).str() }, "20%, 60%": { transform: $.transform().rotate(-25).str() }, "40%, 80%": { transform: $.transform().rotate(10).str() } },
        ".app-sub-sidebar": { "li::before": { content: "'→'", paddingRight: 6, float: $.left, color: $.cssVar("theme-primary"), fontWeight: 600 } },
        ".token": {
            "&.comment, &.prolog, &.doctype, &.cdata": { color: "#8e908c" }, "&.namespace": { opacity: 0.7 }, "&.boolean, &.number": { color: "#0099CC" }, "&.punctuation": { color: "#525252" }, "&.property": { color: "#0088BB" }, "&.tag": { color: "#0066CC" }, "&.string": { color: $.cssVar("theme-primary") }, "&.selector": { color: "#5599FF" }, "&.attr-name": { color: "#0066CC" }, "&.entity, &.url": { color: "#00AEEF" }, "&.attr-value, &.control, &.directive, &.unit": { color: $.cssVar("theme-primary") }, "&.keyword, &.function": { color: "#1E90FF" }, "&.statement, &.regex, &.atrule": { color: "#00AEEF" }, "&.placeholder, &.variable": { color: "#4DA6FF" }, "&.deleted": { textDecoration: "line-through" }, "&.inserted": { borderBottom: "1px dotted #202746", textDecoration: $.none }, "&.italic": { fontStyle: "italic" }, "&.important, &.bold": { fontWeight: "bold" }, "&.important": { color: "#FF6B6B" }, "&.entity": { cursor: "help" }
        },
        ".insoft-logo-corner": { top: 0, right: 10, width: 200, height: $.auto, zIndex: 100, "--br": "0.4px", filter: "drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white) drop-shadow(0px 0px var(--br) white)" },
        "@media print": { ".github-corner, .sidebar-toggle, .sidebar, .app-nav": { display: $.none } },

    }))
})()
