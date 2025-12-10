import { fileURLToPath } from 'url';
import { toCSS } from "../toCSS";
import { HELPERS } from "../helpers";

// Mock helpers for standalone testing if needed, but we import real ones
const $ = HELPERS;

export const runToCSSTests = () => {
    console.log("🧪 Iniciando pruebas de toCSS...");

    let passed = true;

    try {
        // Test 1: Header String
        console.log("🔹 Prueba 1: Header como string...");
        const css1 = toCSS({
            initheader: '@import url("test.css");',
            ".test": { color: "red" }
        });
        if (!css1.startsWith('@import url("test.css");') || !css1.includes(".test{color: red;}")) {
            console.error("❌ Falló Prueba 1");
            console.log("Obtenido:", css1);
            passed = false;
        } else {
            console.log("✅ Prueba 1 Pasó");
        }

        // Test 2: Header Array
        console.log("🔹 Prueba 2: Header como array...");
        const css2 = toCSS({
            initheader: ['@import "a.css";', '@import "b.css";'],
            ".test": { color: "blue" }
        });
        if (!css2.includes('@import "a.css";') || !css2.includes('@import "b.css";') || !css2.includes(".test{color: blue;}")) {
            console.error("❌ Falló Prueba 2");
            console.log("Obtenido:", css2);
            passed = false;
        } else {
            console.log("✅ Prueba 2 Pasó");
        }

        // Test 3: Sin header
        console.log("🔹 Prueba 3: Sin header...");
        const css3 = toCSS({
            ".test": { color: "green" }
        });
        if (css3.includes("@import") || !css3.includes(".test{color: green;}")) {
            console.error("❌ Falló Prueba 3");
            console.log("Obtenido:", css3);
            passed = false;
        } else {
            console.log("✅ Prueba 3 Pasó");
        }

        // Test 4: Arrow Function
        console.log("🔹 Prueba 4: Arrow Function...");
        const css4 = toCSS($ => ({
            ".test-arrow": { color: $.rgb(255, 0, 0) }
        }));
        if (!css4.includes(".test-arrow{color: rgb(255, 0, 0);}")) {
            console.error("❌ Falló Prueba 4");
            console.log("Obtenido:", css4);
            passed = false;
        } else {
            console.log("✅ Prueba 4 Pasó");
        }

        // Test 5: Text Helper (Empty Content)
        console.log("🔹 Prueba 5: Text Helper...");
        const css5 = toCSS($ => ({
            ".test-content::before": { content: $.text("") }
        }));
        // We expect content: ""; or content: '';
        if (!css5.includes('content: "";') && !css5.includes("content: '';")) {
            console.error("❌ Falló Prueba 5");
            console.log("Obtenido:", css5);
            passed = false;
        } else {
            console.log("✅ Prueba 5 Pasó");
        }

        // Test 6: * Selector and Webkit Properties
        console.log("🔹 Prueba 6: * Selector and Webkit...");
        const css6 = toCSS($ => ({
            "*": {
                webkitFontSmoothing: $.antialiased,
                boxSizing: "border-box"
            }
        }));
        if (!css6.includes('*: {') && !css6.includes('"*": {') && !css6.includes("-webkit-font-smoothing: antialiased;")) {
            console.error("❌ Falló Prueba 6");
            console.log("Obtenido:", css6);
            passed = false;
        } else {
            console.log("✅ Prueba 6 Pasó");
        }

        // Test 7: CamelCase Property Conversion
        console.log("🔹 Prueba 7: CamelCase Property Conversion...");
        const css7 = toCSS({
            ".test-camel": {
                borderRight: "1px solid red",
                boxShadow: "none",
                marginTop: "10px",
                zIndex: 100
            }
        });
        const passed7 =
            css7.includes("border-right: 1px solid red;") &&
            css7.includes("box-shadow: none;") &&
            css7.includes("margin-top: 10px;") &&
            css7.includes("z-index: 100;");

        if (!passed7) {
            console.error("❌ Falló Prueba 7");
            console.log("Obtenido raw:", css7);
            passed = false;
        } else {
            console.log("✅ Prueba 7 Pasó");
        }

    } catch (e) {
        console.error("❌ Error ejecutando pruebas:", e);
        passed = false;
    }

    return passed;
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (!runToCSSTests()) {
        console.error("💥 ALGUNAS PRUEBAS FALLARON 💥");
        process.exit(1);
    } else {
        console.log("✨ TODAS LAS PRUEBAS PASARON ✨");
        process.exit(0);
    }
}
