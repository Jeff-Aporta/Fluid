// @ts-nocheck
/** 1. Imports y Configuración Global */
(() => {
    const { StyleSingleton } = window.FluidUI
    StyleSingleton.add("doc-styles-codemirror", $ => ({
        ".code-editor": { display: $.none },
        /** Night Owl Theme Adaptation - Matched to Sidebar */
        ".CodeMirror": {
            backgroundColor: $.rgb(14, 14, 36), /** Matched to sidebar */
            color: "#d6deeb", border: $.border({ width: 1, color: $.rgba(255, 255, 255, 0.1) }), borderRadius: $.px(8), fontFamily: $.font("Consolas", "Monaco", "Courier New", "monospace"),
            fontSize: "0.95em", height: $.auto, minHeight: $.px(100), maxWidth: $.percent(90), margin: $.margin(20, $.auto), boxShadow: $.boxShadow({ dY: 10, blur: 30, color: $.rgba(0, 0, 0, 0.3) })
        },
        ".CodeMirror-gutters": { backgroundColor: $.rgb(14, 14, 36), /** Matched to sidebar */ borderRight: $.border({ width: 1, color: $.rgba(255, 255, 255, 0.05) }) },
        ".CodeMirror-linenumber": { color: "#4b6479" }, ".CodeMirror-cursor": { borderLeft: $.border({ width: 1, color: "#80a4c2" }) },
        ".CodeMirror-selected": { background: $.important($.rgba(29, 59, 83, 0.5)) }, ".CodeMirror-focused .CodeMirror-selected": { background: $.important($.rgba(29, 59, 83, 0.5)) },
        /** Syntax Highlighting - Night Owl Palette */
        ".cm-s-vscode-dark": {
            "span.cm-keyword": { color: $.important("#c792ea"), fontStyle: "italic" }, "span.cm-atom, span.cm-number": { color: $.important("#f78c6c") }, "span.cm-def": { color: $.important("#82aaff") },
            "span.cm-variable": { color: $.important("#d6deeb") }, "span.cm-variable-2": { color: $.important("#addb67") }, "span.cm-variable-3": { color: $.important("#7fdbca") },
            "span.cm-property": { color: $.important("#80cbc4") }, "span.cm-string": { color: $.important("#ecc48d") }, "span.cm-comment": { color: $.important("#637777"), fontStyle: "italic" },
            "span.cm-tag": { color: $.important("#7fdbca") }, "span.cm-attribute": { color: $.important("#addb67") }, "span.cm-operator": { color: $.important("#c792ea") },
            "span.cm-meta": { color: $.important("#82aaff") }, "span.cm-builtin": { color: $.important("#82aaff") }
        },
        /** Scrollbar customization */
        ".CodeMirror-scroll": {
            "::-webkit-scrollbar": { width: $.px(8), height: $.px(8) }, "::-webkit-scrollbar-track": { background: $.transparent },
            "::-webkit-scrollbar-thumb": { background: $.rgba(255, 255, 255, 0.1), borderRadius: $.px(4), transition: $.transition([{ prop: "background", time: "0.2s" }]), "&:hover": { background: $.rgba(255, 255, 255, 0.2) } }
        },
        ".CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler": { backgroundColor: $.rgb(14, 14, 36) }
    }))
})()
