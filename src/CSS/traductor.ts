import { toCSS } from "./toCSS";

// ==========================================
// Tipos
// ==========================================
type TOptions = { camelCase?: boolean };

// ==========================================
// Variables del Módulo
// ==========================================
const commonHelpers = [
    "flex", "block", "none", "inline", "inline-block", "grid",
    "relative", "absolute", "fixed", "sticky", "static",
    "center", "left", "right", "top", "bottom",
    "pointer", "hidden", "visible", "transparent",
    "uppercase", "lowercase", "capitalize",
    "nowrap", "wrap",
    "solid", "dashed", "dotted",
    "flex-start", "flex-end", "space-between", "space-around", "space-evenly",
    "column", "row", "column-reverse", "row-reverse",
    "antialiased", "touch", "normal"
];

// ==========================================
// Funciones Flecha
// ==========================================

// Divide cadena por comas respetando paréntesis anidados
const splitByComma = (str: string): string[] => {
    const parts: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === "(") depth++;
        else if (char === ")") depth--;

        if (char === "," && depth === 0) parts.push(current.trim()), (current = "");
        else current += char;
    }

    if (current) parts.push(current.trim());
    return parts;
};

// Divide cadena por espacios respetando paréntesis anidados
const splitBySpace = (str: string): string[] => {
    const parts: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === "(") depth++;
        else if (char === ")") depth--;

        if (/\s/.test(char) && depth === 0) {
            if (current) parts.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    if (current) parts.push(current.trim());
    return parts;
};

// Mapea valores CSS a helpers de Fluid
const mapValue = (val: string): string => {
    val = val.trim();
    if (!val) return "";
    if (val === "''" || val === '""') return '$.text("")';

    // Manejo de !important
    if (val.toLowerCase().endsWith("!important")) return `$.important(${mapValue(val.replace(/!important$/i, "").trim())})`;

    // Manejo de auto
    if (val === "auto") return "$.auto";

    // Números con px
    if (/^-?\d+(\.\d+)?px$/.test(val)) return val.replace("px", "");

    // Números planos
    if (/^-?\d+(\.\d+)?$/.test(val)) return val;

    // Verificar helpers comunes
    const camelVal = val.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    if (commonHelpers.includes(val) || commonHelpers.includes(camelVal)) return `$.${camelVal}`;

    // Gradiente lineal
    if (val.startsWith("linear-gradient(")) {
        const content = val.slice(16, -1);
        const parts = splitByComma(content);

        if (parts.length >= 2) {
            let dir = parts[0];
            let stops = parts.slice(1);
            let dirVal = "0";

            if (dir.includes("deg") || dir.includes("to ")) {
                dirVal = dir.replace("deg", "");
                if (isNaN(parseFloat(dirVal))) dirVal = `"${dir}"`;
            } else {
                stops = parts;
                dirVal = "180";
            }

            const mappedStops = stops.map(s => {
                const stopParts = s.split(/\s+(?![^(]*\))/);
                const color = mapValue(stopParts[0]);
                if (stopParts.length > 1) return `[${color}, ${stopParts[1].replace("%", "")}]`;
                return color;
            });

            return `$.linearGradient({ dir: ${dirVal}, stops: [${mappedStops.join(", ")}] })`;
        }
    }

    // Gradiente radial
    if (val.startsWith("radial-gradient(")) {
        const content = val.slice(16, -1);
        const parts = splitByComma(content);
        let shape = "";
        let at = "";
        let stops = parts;
        const first = parts[0];

        if (first.includes("at ") || /^(circle|ellipse|closest|farthest)/.test(first)) {
            stops = parts.slice(1);
            const defParts = first.split(" at ");
            if (defParts.length === 2) {
                shape = defParts[0].trim();
                const coords = defParts[1].trim().split(/\s+/);
                if (coords.length >= 2) at = `{ x: "${coords[0]}", y: "${coords[1]}" }`;
                else at = `"${defParts[1].trim()}"`;
            } else shape = first;
        }

        const mappedStops = stops.map((s, idx) => {
            const stopParts = s.split(/\s+(?![^(]*\))/);
            const color = mapValue(stopParts[0]);
            if (stopParts.length > 1) return `[${color}, ${stopParts[1].replace("%", "")}]`;
            if (idx === 0) return `[${color}, 0]`;
            return color;
        });

        const args: string[] = [];
        if (shape) args.push(`shape: "${shape}"`);
        if (at) args.push(`at: ${at}`);
        args.push(`stops: [${mappedStops.join(", ")}]`);

        return `$.radialGradient({ ${args.join(", ")} })`;
    }

    // Unidades
    if (val.endsWith("vw")) return `$.vw(${val.replace("vw", "")})`;
    if (val.endsWith("vh")) return `$.vh(${val.replace("vh", "")})`;
    if (val.endsWith("%")) return `$.percent(${val.replace("%", "")})`;
    if (val.endsWith("ms")) return `$.ms(${val.replace("ms", "")})`;
    if (val.endsWith("s")) return `$.s(${val.replace("s", "")})`;
    if (val.endsWith("deg")) return `$.deg(${val.replace("deg", "")})`;
    if (val.endsWith("rem")) return `$.rem(${val.replace("rem", "")})`;
    if (val.endsWith("em")) return `$.em(${val.replace("em", "")})`;

    // Colores Hex
    if (val.startsWith("#")) return `"${val}"`;

    // Funciones de color y URL
    if (val.startsWith("rgba(")) {
        const parts = val.slice(5, -1).split(",").map(s => s.trim());
        if (parts.length === 4 && parts[0] === parts[1] && parts[1] === parts[2]) {
            return `$.rgba(${parts[0]}, ${parts[3]})`;
        }
        return `$.rgba(${parts.join(", ")})`;
    }
    if (val.startsWith("rgb(")) return `$.rgb(${val.slice(4, -1).split(",").map(s => s.trim()).join(", ")})`;
    if (val.startsWith("url(")) return `$.url("${val.replace("url(", "").replace(")", "").replace(/['"]/g, "")}")`;
    if (val.startsWith("var(")) return `$.cssVar("${val.slice(4, -1).replace(/^--/, "")}")`;

    return `"${val}"`;
};

// Mapea propiedades específicas
const mapPropValue = (prop: string, val: string): string => {
    const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    // Background
    if (camelProp === "background") {
        const parts = splitByComma(val).map(v => mapValue(v));
        if (parts.length > 1) return `$.background(${parts.join(", ")})`;
        return parts[0];
    }

    // Padding / Margin
    if (camelProp === "padding" || camelProp === "margin") {
        const parts = val.split(/\s+(?![^(]*\))/).map(v => mapValue(v));
        if (parts.length === 1) return parts[0];
        return `$.${camelProp}(${parts.join(", ")})`;
    }

    // Border
    if (camelProp.startsWith("border")) {
        if (val === "0" || val === "0px") return "0";

        const parts = val.split(/\s+(?![^(]*\))/);
        let width = "1", style = "\"solid\"", color = "\"black\"";
        let widthFound = false;

        parts.forEach(p => {
            if (/^-?\d+(\.\d+)?(px)?$/.test(p)) (width = p.replace("px", "")), (widthFound = true);
            else if (["solid", "dashed", "dotted", "none", "hidden", "double", "groove", "ridge", "inset", "outset"].includes(p)) style = `"${p}"`;
            else color = mapValue(p);
        });

        const args: string[] = [];
        if (width !== "1" || widthFound) args.push(`width: ${width}`);
        if (style !== "\"solid\"") args.push(`style: ${style}`);
        if (color !== "\"black\"") args.push(`color: ${color}`);

        return `$.border({ ${args.join(", ")} })`;
    }

    // Box Shadow
    if (camelProp === "boxShadow") {
        if (val === "none") return "$.none";
        const shadows = splitByComma(val);
        const parsed = shadows.map(s => {
            const parts = s.trim().split(/\s+(?![^(]*\))/);
            let inset = false;
            let color = "";
            const lengths: string[] = [];

            parts.forEach(p => {
                if (p === "inset") inset = true;
                else if (/^-?\d+(\.\d+)?(px|em|rem|%)?$/.test(p) || p === "0") lengths.push(mapValue(p));
                else color = mapValue(p);
            });

            const args: string[] = [];
            if (lengths.length > 0 && lengths[0] !== "0") args.push(`dX: ${lengths[0]}`);
            if (lengths.length > 1 && lengths[1] !== "0") args.push(`dY: ${lengths[1]}`);
            if (lengths.length > 2 && lengths[2] !== "0") args.push(`blur: ${lengths[2]}`);
            if (lengths.length > 3 && lengths[3] !== "0") args.push(`spread: ${lengths[3]}`);
            if (color) args.push(`color: ${color}`);
            if (inset) args.push(`inset: true`);

            return `$.boxShadow({ ${args.join(", ")} })`;
        });

        if (parsed.length === 1) return parsed[0];
        return `[${parsed.join(", ")}]`;
    }

    // Transition
    if (camelProp === "transition") {
        const transitions = splitByComma(val);
        const parsed = transitions.map(t => {
            const parts = splitBySpace(t);
            let prop = "all";
            let time: string | null = null;
            let ease: string | null = null;
            let delay: string | null = null;

            parts.forEach(p => {
                if (p.endsWith("ms") || p.endsWith("s")) {
                    if (time === null) time = p;
                    else delay = p;
                } else if (["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].includes(p)) {
                    ease = p;
                } else if (p.startsWith("cubic-bezier")) {
                    const match = p.match(/cubic-bezier\(([^)]+)\)/);
                    if (match) {
                        ease = `$.cubicBezier(${match[1]})`;
                    } else {
                        ease = p;
                    }
                } else if (p.startsWith("var(")) {
                    const mapped = mapValue(p);
                    if (time === null) time = mapped;
                    else if (ease === null) ease = mapped;
                    else delay = mapped;
                } else if (p !== "all") {
                    prop = p;
                }
            });

            const args: string[] = [`prop: "${prop}"`];
            if (time) args.push(`time: ${(time as string).startsWith("$.") ? time : `"${time}"`}`);
            if (ease && ease !== "ease") args.push(`ease: ${(ease as string).startsWith("$.") ? ease : `"${ease}"`}`);
            if (delay) args.push(`delay: ${(delay as string).startsWith("$.") ? delay : `"${delay}"`}`);

            return `{ ${args.join(", ")} }`;
        });

        return `$.transition(${parsed.join(", ")})`;
    }

    // Transform
    if (camelProp === "transform") {
        const transforms = val.split(/\s+(?![^(]*\))/).map(t => t.trim());
        let chain = "$.transform()";

        transforms.forEach(t => {
            const match = t.match(/^([a-zA-Z0-9]+)\((.*)\)$/);
            if (match) {
                const name = match[1];
                const args = match[2].split(",").map(a => {
                    a = a.trim();
                    if (/^-?\d+(\.\d+)?px$/.test(a)) return a.replace("px", "");
                    return a;
                });
                chain += `.${name}(${args.join(", ")})`;
            }
        });

        return `${chain}.str()`;
    }

    // Font Family
    if (camelProp === "fontFamily") {
        const families = splitByComma(val).map(f => {
            f = f.trim();
            if (f.startsWith('"') || f.startsWith("'")) return f;
            return `"${f}"`;
        });
        return `$.fontFamily(${families.join(", ")})`;
    }

    // Filter
    if (camelProp === "filter") {
        const filters = splitBySpace(val).map(f => f.trim()).filter(f => f);
        const parsed = filters.map(f => {
            const match = f.match(/^([a-zA-Z0-9-]+)\((.*)\)$/);
            if (match) {
                const name = match[1];
                const argsStr = match[2];

                if (name === "drop-shadow") {
                    const parts = splitBySpace(argsStr);
                    let color = "";
                    const lengths: string[] = [];

                    parts.forEach(p => {
                        if (/^-?\d+(\.\d+)?(px|em|rem|%)?$/.test(p) || p === "0" || p.startsWith("var(")) lengths.push(mapValue(p));
                        else color = mapValue(p);
                    });

                    // Si hay más de 3 longitudes, la última es probablemente el color (si es variable)
                    if (lengths.length > 3 && !color) {
                        color = lengths.pop()!;
                    }

                    const args: string[] = [];
                    if (lengths.length > 0 && lengths[0] !== "0") args.push(`dX: ${lengths[0]}`);
                    if (lengths.length > 1 && lengths[1] !== "0") args.push(`dY: ${lengths[1]}`);
                    if (lengths.length > 2 && lengths[2] !== "0") args.push(`blur: ${lengths[2]}`);
                    if (color) args.push(`color: ${color}`);

                    return `$.dropShadow({ ${args.join(", ")} })`;
                } else {
                    // Otros filtros (blur, brightness, etc.)
                    const camelName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    let arg = argsStr;
                    if (camelName === "hueRotate" && arg.endsWith("deg")) {
                        arg = arg.replace("deg", "");
                    }
                    const mappedArg = mapValue(arg);
                    return `$.${camelName}(${mappedArg})`;
                }
            }
            return mapValue(f);
        });

        return `$.filter(${parsed.join(", ")})`;
    }

    return mapValue(val);
};

// Mapea propiedades de kebab a camelCase
const mapProp = (prop: string, camelCase: boolean): string => {
    if (camelCase) {
        if (prop.startsWith("-webkit-")) return prop.replace("-webkit-", "webkit-").replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (prop.startsWith("-moz-")) return `"${prop}"`;
        return prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
    return `"${prop}"`;
};

// Parsea un bloque de CSS recursivamente
const parseBlock = (css: string, depth: number, options: TOptions): string => {
    const props: string[] = [];
    const vars: string[] = [];
    const children: string[] = [];
    const headers: string[] = [];
    let buffer = "";
    let inString: string | false = false;
    let pDepth = 0;

    for (let i = 0; i < css.length; i++) {
        const char = css[i];

        if (char === '"' || char === "'") {
            if (!inString) inString = char;
            else if (inString === char) inString = false;
        }

        if (inString) {
            buffer += char;
            continue;
        }

        if (char === "(") pDepth++;
        else if (char === ")") pDepth--;

        if (char === "{" && pDepth === 0) {
            const selector = buffer.trim();
            buffer = "";

            let bDepth = 1;
            let j = i + 1;
            let inStr2: string | false = false;

            for (; j < css.length; j++) {
                const c2 = css[j];
                if (c2 === '"' || c2 === "'") {
                    if (!inStr2) inStr2 = c2;
                    else if (inStr2 === c2) inStr2 = false;
                }
                if (!inStr2) {
                    if (c2 === "{") bDepth++;
                    else if (c2 === "}") bDepth--;
                }
                if (bDepth === 0) break;
            }

            const blockContent = css.substring(i + 1, j);
            i = j;

            const childBody = parseBlock(blockContent, depth + 1, options);
            const key = selector.includes("&") || selector.startsWith(":") || selector.startsWith("@") || selector.includes(" ") || selector.includes(".") || selector.includes("#") || selector.includes("*") ? `"${selector}"` : selector;
            children.push(`${"    ".repeat(depth)}${key}: ${childBody}`);
        } else if ((char === ";" || char === "}") && pDepth === 0) {
            const trimmedBuffer = buffer.trim();
            if (trimmedBuffer) {
                if (trimmedBuffer.startsWith("@import")) {
                    headers.push(trimmedBuffer + (char === ";" ? ";" : ""));
                } else {
                    const parts = buffer.split(":");
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const val = parts.slice(1).join(":").trim();

                        if (key.startsWith("--")) {
                            const varName = mapProp(key.substring(2), true);
                            let mappedVal = mapValue(val);
                            if (varName.toLowerCase().includes("shadow")) {
                                mappedVal = mapPropValue("boxShadow", val);
                            }
                            vars.push(`${"    ".repeat(depth + 1)}${varName}: ${mappedVal}`);
                        } else {
                            const propName = mapProp(key, !!options.camelCase);
                            props.push(`${"    ".repeat(depth)}${propName}: ${mapPropValue(key, val)}`);
                        }
                    }
                }
            }
            buffer = "";
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        const trimmedBuffer = buffer.trim();
        if (trimmedBuffer.startsWith("@import")) {
            headers.push(trimmedBuffer);
        } else {
            const parts = buffer.split(":");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join(":").trim();
                if (key.startsWith("--")) {
                    const varName = mapProp(key.substring(2), true);
                    let mappedVal = mapValue(val);
                    if (varName.toLowerCase().includes("shadow")) {
                        mappedVal = mapPropValue("boxShadow", val);
                    }
                    vars.push(`${"    ".repeat(depth + 1)}${varName}: ${mappedVal}`);
                } else {
                    const propName = mapProp(key, !!options.camelCase);
                    props.push(`${"    ".repeat(depth)}${propName}: ${mapPropValue(key, val)}`);
                }
            }
        }
    }

    let js = "{\n";
    if (headers.length > 0) {
        if (headers.length === 1) {
            // Use JSON.stringify to safely quote the string, but replace double quotes with single if preferred, 
            // or just keep double quotes. The existing code uses double quotes often.
            // But wait, the expected output in the test uses single quotes for the key 'initheader'.
            // And the value is a string containing double quotes.
            // JSON.stringify will escape double quotes: "@import url(\"...\")"
            // This is fine.
            js += `${"    ".repeat(depth)}initheader: ${JSON.stringify(headers[0])},\n`;
        } else {
            js += `${"    ".repeat(depth)}initheader: [${headers.map(h => JSON.stringify(h)).join(", ")}],\n`;
        }
    }
    if (vars.length > 0) {
        js += `${"    ".repeat(depth)}vars: {\n`;
        js += vars.join(",\n") + ",\n";
        js += `${"    ".repeat(depth)}},\n`;
    }
    if (props.length > 0) js += props.join(",\n") + ",\n";
    if (children.length > 0) js += children.join(",\n") + ",\n";
    js += `${"    ".repeat(depth - 1)}}`;

    return js;
};

// ==========================================
// Funciones Estándar y Clases
// ==========================================

// Función principal de traducción
export function traductor(css: string, options: TOptions = { camelCase: true }): string {
    // Eliminar comentarios
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Normalizar espacios
    css = css.replace(/\s+/g, " ").trim();

    // Parsear cuerpo principal
    const body = parseBlock(css, 1, options);

    // Ajustar formato para retorno de función
    return `$ => (${body})`;
}

// Función inversa: JS string a CSS string
export function translateToCSS(js: string): string {
    try {
        // Evaluar el string JS para obtener la función o el objeto
        // Se espera que sea una arrow function: $ => ({ ... })
        // O un objeto literal: { ... }

        // En un entorno seguro, esto debería ser más robusto.
        // Pero para esta herramienta de desarrollo, eval es aceptable.

        // Nota: Si el string es un objeto literal, eval podría interpretarlo como bloque.
        // Envolver en paréntesis ayuda: eval("(" + js + ")")
        // Pero traductor devuelve $ => ({...}), que es una expresión válida.

        let evaluated = eval(js);

        // toCSS maneja tanto objetos como funciones (helpers) => options
        // Forzamos pretty: true para que el output sea legible en el editor
        if (typeof evaluated === 'function') {
            const originalFn = evaluated;
            evaluated = (helpers: any) => {
                const res = originalFn(helpers);
                return { ...res, pretty: true };
            }
        } else if (typeof evaluated === 'object' && evaluated !== null) {
            evaluated = { ...evaluated, pretty: true };
        }

        return toCSS(evaluated);
    } catch (error) {
        console.error("Error en translateToCSS:", error);
        return "";
    }
}