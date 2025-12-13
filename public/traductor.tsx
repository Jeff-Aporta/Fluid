// @ts-nocheck
/** 1. Imports */
const { FluidUI, CodeMirror, ReactDOM, React: { useState, useEffect, useRef } } = window;
/** 6. Funciones Estándar y Clases */
/** Componente principal del traductor */ function TraductorApp() {
    const [cssInput, setCssInput] = useState("");
    const [jsOutput, setJsOutput] = useState("");
    const [error, setError] = useState(null);
    const cssEditorRef = useRef(null);
    const jsEditorRef = useRef(null);
    const cssInstance = useRef(null);
    const jsInstance = useRef(null);
    /** Inicializa editor CSS */ useEffect(() => {
        if (cssEditorRef.current && !cssInstance.current) {
            cssInstance.current = CodeMirror(cssEditorRef.current, { mode: "css", theme: "dracula", lineNumbers: true, lineWrapping: false, value: cssInput });
            cssInstance.current.on("change", (instance: any, changeObj: any) => {
                if (changeObj.origin === "setValue") return;
                const value = instance.getValue();
                setCssInput(value);
                translateToJS(value);
            });
        }
        if (jsEditorRef.current && !jsInstance.current) {
            jsInstance.current = CodeMirror(jsEditorRef.current, { mode: "javascript", theme: "dracula", lineNumbers: true, lineWrapping: false, readOnly: false, value: jsOutput });
            jsInstance.current.on("change", (instance: any, changeObj: any) => {
                if (changeObj.origin === "setValue") return;
                const value = instance.getValue();
                setJsOutput(value);
                translateToCSS(value);
            });
        }
    }, []);
    /** Sincroniza CSS input */ useEffect(() => {
        if (cssInstance.current && cssInstance.current.getValue() !== cssInput) cssInstance.current.setValue(cssInput);
    }, [cssInput]);
    /** Sincroniza JS output */ useEffect(() => {
        if (jsInstance.current && jsInstance.current.getValue() !== jsOutput) jsInstance.current.setValue(jsOutput);
    }, [jsOutput]);
    /** Traduce CSS a JS */ const translateToJS = (css: string) => {
        try {
            setError(null);
            if (!css.trim()) return setJsOutput("");
            if (typeof FluidUI === "undefined" || !FluidUI.traductor) throw new Error("FluidUI.traductor no está disponible.");
            setJsOutput(FluidUI.traductor(css));
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };
    /** Traduce JS a CSS */ const translateToCSS = (js: string) => {
        try {
            setError(null);
            if (!js.trim()) return setCssInput("");
            if (typeof FluidUI === "undefined" || !FluidUI.toCSS) throw new Error("FluidUI.toCSS no está disponible.");
            let arrowFn;
            try { arrowFn = eval(js); } catch (e) { return; }
            if (typeof arrowFn !== "function") return;
            setCssInput(FluidUI.toCSS(arrowFn));
        } catch (err) {
            console.error("Error translating JS to CSS:", err);
        }
    };
    return (
        <div className="app-container">
            <div className="header">
                <h1><i className="fas fa-exchange-alt"></i> Traductor CSS a Fluid JS</h1>
            </div>
            <div className="container">
                <div className="pane">
                    <div className="pane-header">CSS (Entrada)</div>
                    <div className="editor-container" ref={cssEditorRef}></div>
                    {error && <div className="error-container"><strong>Error:</strong> {error}</div>}
                </div>
                <div className="pane">
                    <div className="pane-header">Fluid JS (Salida)</div>
                    <div className="editor-container" ref={jsEditorRef}></div>
                </div>
            </div>
        </div>
    );
}
/** 8. Inicialización del módulo */
(function moduloInicio() {
    FluidUI?.insertStyle?.({
        css: ($: any) => ({
            body: { fontFamily: $.fontFamily('Segoe UI', "Tahoma", "Geneva", "Verdana", "sans-serif"), margin: 0, padding: 0, backgroundColor: "#1e1e1e", color: "#d4d4d4", height: $.vh(100), display: $.flex, flexDirection: $.column },
            "#root": { height: $.percent(100), display: $.flex, flexDirection: $.column },
            ".app-container": { height: $.percent(100), display: $.flex, flexDirection: $.column },
            ".header": { padding: $.padding(1, 2, $.rem), backgroundColor: "#252526", borderBottom: $.border({ width: 1, color: "#333" }), display: $.flex, alignItems: $.center, justifyContent: $.spaceBetween },
            ".header h1": { margin: 0, fontSize: $.rem(1.2), color: "#00AEEF" },
            ".container": { flex: 1, display: $.flex, overflow: $.hidden },
            ".pane": { flex: 1, display: $.flex, flexDirection: $.column, borderRight: $.border({ width: 1, color: "#333" }), minWidth: 0 },
            ".pane:last-child": { borderRight: $.border({ style: "none" }) },
            ".pane-header": { padding: $.padding(0.5, 1, $.rem), backgroundColor: "#2d2d2d", fontSize: $.rem(0.9), fontWeight: 600, color: "#ccc", borderBottom: $.border({ width: 1, color: "#333" }) },
            ".editor-container": { flex: 1, position: $.relative, overflow: $.hidden },
            ".CodeMirror": { height: $.important($.percent(100)), fontFamily: $.fontFamily('Fira Code', "Consolas", "monospace"), fontSize: 14 },
            ".error-container": { backgroundColor: "#5a1d1d", color: "#ffcccc", padding: $.padding(1, $.rem), borderTop: $.border({ width: 1, color: "#ff0000" }), fontFamily: $.fontFamily("monospace"), maxHeight: 150, overflowY: $.auto },
            ".hidden": { display: $.none }
        })
    });
    /** Renderiza aplicación */
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<TraductorApp />);
})();