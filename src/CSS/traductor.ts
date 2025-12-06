/** 1. Imports */
import { toCSS } from "./toCSS"

/** 2. Types */
type TOptions = { camelCase?: boolean }

/** 4. Variables del Módulo */
const HELPERS = ["flex", "block", "none", "inline", "inline-block", "grid", "relative", "absolute", "fixed", "sticky", "static", "center", "left", "right", "top", "bottom", "pointer", "hidden", "visible", "transparent", "uppercase", "lowercase", "capitalize", "nowrap", "wrap", "solid", "dashed", "dotted", "flex-start", "flex-end", "space-between", "space-around", "space-evenly", "column", "row", "column-reverse", "row-reverse", "antialiased", "touch", "normal"]
const REGEX_PX = /^-?\d+(\.\d+)?px$/ /** valida valor en px */
const REGEX_NUM = /^-?\d+(\.\d+)?$/ /** valida numero simple */
const REGEX_KEBAB = /-(.)/g /** captura propiedad kebab para camelize */
const REGEX_TRANSFORM = /^([a-zA-Z0-9]+)\((.*)\)$/ /** captura transform functions */
const REGEX_MEASURE = /^-?\d+(\.\d+)?(px|em|rem|%)?$/ /** valida medida con unidad opcional */
const REGEX_FILTER = /^([a-zA-Z0-9-]+)\((.*)\)$/ /** captura filter functions */

/** 5. Arrow Functions */
const splitByComma = (str: string): string[] => {
    const parts: string[] = []
    let current = "", depth = 0
    for (let char of str) {
        if (char === "(") depth++
        else if (char === ")") depth--
        if (char === "," && depth === 0) (parts.push(current.trim()), current = "")
        else current += char
    }
    if (current) parts.push(current.trim())
    return parts
}

const splitBySpace = (str: string): string[] => {
    const parts: string[] = []
    let current = "", depth = 0
    for (let char of str) {
        if (char === "(") depth++
        else if (char === ")") depth--
        if (/\s/.test(char) && depth === 0) (current && parts.push(current.trim()), current = "")
        else current += char
    }
    if (current) parts.push(current.trim())
    return parts
}

const mapValue = (val: string): string => {
    val = val.trim()
    if (!val) return ""
    if (val === "''" || val === '""') return '$.text("")'
    if (val.toLowerCase().endsWith("!important")) return `$.important(${mapValue(val.replace(/!important$/i, "").trim())})`
    if (val === "auto") return "$.auto"
    if (REGEX_PX.test(val)) return val.replace("px", "")
    if (REGEX_NUM.test(val)) return val

    const camelVal = val.replace(REGEX_KEBAB, (_, c) => c.toUpperCase())
    if (HELPERS.includes(val) || HELPERS.includes(camelVal)) return `$.${camelVal}`

    if (val.startsWith("linear-gradient(")) {
        const content = val.slice(16, -1), parts = splitByComma(content)
        if (parts.length >= 2) {
            let dir = parts[0], stops = parts.slice(1), dirVal = "0"
            if (dir.includes("deg") || dir.includes("to ")) {
                dirVal = dir.replace("deg", "")
                if (isNaN(parseFloat(dirVal))) dirVal = `"${dir}"`
            } else (stops = parts, dirVal = "180")
            const mappedStops = stops.map(s => {
                const [c, p] = s.split(/\s+(?![^(]*\))/); return p ? `[${mapValue(c)}, ${p.replace("%", "")}]` : mapValue(c)
            })
            return `$.linearGradient({ dir: ${dirVal}, stops: [${mappedStops.join(", ")}] })`
        }
    }
    if (val.startsWith("radial-gradient(")) {
        const content = val.slice(16, -1), parts = splitByComma(content)
        let shape = "", at = "", stops = parts, first = parts[0]
        if (first.includes("at ") || /^(circle|ellipse|closest|farthest)/.test(first)) {
            stops = parts.slice(1)
            const defParts = first.split(" at ")
            if (defParts.length === 2) {
                const coords = defParts[1].trim().split(/\s+/)
                shape = defParts[0].trim()
                at = coords.length >= 2 ? `{ x: "${coords[0]}", y: "${coords[1]}" }` : `"${defParts[1].trim()}"`
            } else shape = first
        }
        const mappedStops = stops.map((s, idx) => {
            const [c, p] = s.split(/\s+(?![^(]*\))/); return p ? `[${mapValue(c)}, ${p.replace("%", "")}]` : idx === 0 ? `[${mapValue(c)}, 0]` : mapValue(c)
        })
        const args: string[] = []
        if (shape) args.push(`shape: "${shape}"`)
        if (at) args.push(`at: ${at}`)
        args.push(`stops: [${mappedStops.join(", ")}]`)
        return `$.radialGradient({ ${args.join(", ")} })`
    }

    if (val.endsWith("vw")) return `$.vw(${val.replace("vw", "")})`
    if (val.endsWith("vh")) return `$.vh(${val.replace("vh", "")})`
    if (val.endsWith("%")) return `$.percent(${val.replace("%", "")})`
    if (val.endsWith("ms")) return `$.ms(${val.replace("ms", "")})`
    if (val.endsWith("s")) return `$.s(${val.replace("s", "")})`
    if (val.endsWith("deg")) return `$.deg(${val.replace("deg", "")})`
    if (val.endsWith("rem")) return `$.rem(${val.replace("rem", "")})`
    if (val.endsWith("em")) return `$.em(${val.replace("em", "")})`
    if (val.startsWith("#")) return `"${val}"`
    if (val.startsWith("rgba(")) {
        const parts = val.slice(5, -1).split(",").map(s => s.trim())
        return parts.length === 4 && parts[0] === parts[1] && parts[1] === parts[2] ? `$.rgba(${parts[0]}, ${parts[3]})` : `$.rgba(${parts.join(", ")})`
    }
    if (val.startsWith("rgb(")) return `$.rgb(${val.slice(4, -1).split(",").map(s => s.trim()).join(", ")})`
    if (val.startsWith("url(")) return `$.url("${val.replace("url(", "").replace(")", "").replace(/['"]/g, "")}")`
    if (val.startsWith("var(")) return `$.cssVar("${val.slice(4, -1).replace(/^--/, "")}")`
    return `"${val}"`
}

const mapPropValue = (prop: string, val: string): string => {
    const camelProp = prop.replace(REGEX_KEBAB, (_, c) => c.toUpperCase())

    if (camelProp === "background") {
        const parts = splitByComma(val).map(mapValue)
        return parts.length > 1 ? `$.background(${parts.join(", ")})` : parts[0]
    }
    if (camelProp === "padding" || camelProp === "margin") {
        const parts = val.split(/\s+(?![^(]*\))/).map(mapValue)
        return parts.length === 1 ? parts[0] : `$.${camelProp}(${parts.join(", ")})`
    }
    if (camelProp.startsWith("border")) {
        if (val === "0" || val === "0px") return "0"
        const parts = val.split(/\s+(?![^(]*\))/)
        let width = "1", style = '"solid"', color = '"black"', widthFound = false
        parts.forEach(p => {
            if (/^-?\d+(\.\d+)?(px)?$/.test(p)) (width = p.replace("px", ""), widthFound = true)
            else if (["solid", "dashed", "dotted", "none", "hidden", "double", "groove", "ridge", "inset", "outset"].includes(p)) style = `"${p}"`
            else color = mapValue(p)
        })
        const args: string[] = []
        if (width !== "1" || widthFound) args.push(`width: ${width}`)
        if (style !== '"solid"') args.push(`style: ${style}`)
        if (color !== '"black"') args.push(`color: ${color}`)
        return `$.border({ ${args.join(", ")} })`
    }
    if (camelProp === "boxShadow") {
        if (val === "none") return "$.none"
        const parsed = splitByComma(val).map(s => {
            const parts = s.trim().split(/\s+(?![^(]*\))/), lengths: string[] = []
            let inset = false, color = ""
            parts.forEach(p => {
                if (p === "inset") inset = true
                else if (REGEX_MEASURE.test(p) || p === "0") lengths.push(mapValue(p))
                else color = mapValue(p)
            })
            const args: string[] = []
            if (lengths[0] && lengths[0] !== "0") args.push(`dX: ${lengths[0]}`)
            if (lengths[1] && lengths[1] !== "0") args.push(`dY: ${lengths[1]}`)
            if (lengths[2] && lengths[2] !== "0") args.push(`blur: ${lengths[2]}`)
            if (lengths[3] && lengths[3] !== "0") args.push(`spread: ${lengths[3]}`)
            if (color) args.push(`color: ${color}`)
            if (inset) args.push(`inset: true`)
            return `$.boxShadow({ ${args.join(", ")} })`
        })
        return parsed.length === 1 ? parsed[0] : `[${parsed.join(", ")}]`
    }
    if (camelProp === "transition") {
        const parsed = splitByComma(val).map(t => {
            const parts = splitBySpace(t)
            let prop = "all", time: string | null = null, ease: string | null = null, delay: string | null = null
            parts.forEach(p => {
                if (p.endsWith("ms") || p.endsWith("s")) (!time ? time = p : delay = p)
                else if (["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].includes(p)) ease = p
                else if (p.startsWith("cubic-bezier")) ease = `$.cubicBezier(${p.match(/cubic-bezier\(([^)]+)\)/)?.[1] ?? ""})`
                else if (p.startsWith("var(")) { const m = mapValue(p); (!time ? time = m : !ease ? ease = m : delay = m) }
                else if (p !== "all") prop = p
            })
            const args = [`prop: "${prop}"`]
            if (time) args.push(`time: ${(time as string).startsWith("$.") ? time : `"${time}"`}`)
            if (ease && ease !== "ease") args.push(`ease: ${(ease as string).startsWith("$.") ? ease : `"${ease}"`}`)
            if (delay) args.push(`delay: ${(delay as string).startsWith("$.") ? delay : `"${delay}"`}`)
            return `{ ${args.join(", ")} }`
        })
        return `$.transition(${parsed.join(", ")})`
    }
    if (camelProp === "transform") {
        const transforms = val.split(/\s+(?![^(]*\))/).map(t => t.trim())
        let chain = "$.transform()"
        transforms.forEach(t => {
            const match = t.match(REGEX_TRANSFORM)
            if (match) chain += `.${match[1]}(${match[2].split(",").map(a => (a = a.trim(), REGEX_PX.test(a) ? a.replace("px", "") : a)).join(", ")})`
        })
        return `${chain}.str()`
    }
    if (camelProp === "fontFamily") return `$.fontFamily(${splitByComma(val).map(f => (f = f.trim(), (f.startsWith('"') || f.startsWith("'")) ? f : `"${f}"`)).join(", ")})`
    if (camelProp === "filter") {
        const parsed = splitBySpace(val).map(f => f.trim()).filter(f => f).map(f => {
            const match = f.match(REGEX_FILTER)
            if (match) {
                const name = match[1], argsStr = match[2]
                if (name === "drop-shadow") {
                    const parts = splitBySpace(argsStr)
                    let color = "", lengths: string[] = []
                    parts.forEach(p => {
                        if (REGEX_MEASURE.test(p) || p === "0" || p.startsWith("var(")) lengths.push(mapValue(p))
                        else color = mapValue(p)
                    })
                    if (lengths.length > 3 && !color) color = lengths.pop()!
                    const args: string[] = []
                    if (lengths[0] && lengths[0] !== "0") args.push(`dX: ${lengths[0]}`)
                    if (lengths[1] && lengths[1] !== "0") args.push(`dY: ${lengths[1]}`)
                    if (lengths[2] && lengths[2] !== "0") args.push(`blur: ${lengths[2]}`)
                    if (color) args.push(`color: ${color}`)
                    return `$.dropShadow({ ${args.join(", ")} })`
                } else {
                    const camelName = name.replace(REGEX_KEBAB, (_, c) => c.toUpperCase())
                    return `$.${camelName}(${mapValue(camelName === "hueRotate" && argsStr.endsWith("deg") ? argsStr.replace("deg", "") : argsStr)})`
                }
            }
            return mapValue(f)
        })
        return `$.filter(${parsed.join(", ")})`
    }
    return mapValue(val)
}

const mapProp = (prop: string, camelCase: boolean): string => {
    if (camelCase) {
        if (prop.startsWith("-webkit-")) return prop.replace("-webkit-", "webkit-").replace(REGEX_KEBAB, (_, c) => c.toUpperCase())
        if (prop.startsWith("-moz-")) return `"${prop}"`
        return prop.replace(REGEX_KEBAB, (_, c) => c.toUpperCase())
    }
    return `"${prop}"`
}

const parseBlock = (css: string, depth: number, options: TOptions): string => {
    const props: string[] = [], vars: string[] = [], children: string[] = [], headers: string[] = []
    let buffer = "", inString: string | false = false, pDepth = 0
    for (let i = 0; i < css.length; i++) {
        const char = css[i]
        if (char === '"' || char === "'") (!inString ? inString = char : inString === char && (inString = false))
        if (inString) { buffer += char; continue }
        if (char === "(") pDepth++
        else if (char === ")") pDepth--
        if (char === "{" && pDepth === 0) {
            const selector = buffer.trim(); buffer = ""
            let bDepth = 1, j = i + 1, inStr2: string | false = false
            for (; j < css.length; j++) {
                const c2 = css[j]
                if (c2 === '"' || c2 === "'") (!inStr2 ? inStr2 = c2 : inStr2 === c2 && (inStr2 = false))
                if (!inStr2) (c2 === "{" ? bDepth++ : c2 === "}" && bDepth--)
                if (bDepth === 0) break
            }
            const blockContent = css.substring(i + 1, j)
            i = j
            const childBody = parseBlock(blockContent, depth + 1, options)
            const isPercentage = /^\d+%$/.test(selector)
            const key = selector.includes("&") || selector.startsWith(":") || selector.startsWith("@") || selector.includes(" ") || selector.includes(".") || selector.includes("#") || selector.includes("*") || isPercentage ? `"${selector}"` : selector
            children.push(`${"    ".repeat(depth)}${key}: ${childBody}`)
        } else if ((char === ";" || char === "}") && pDepth === 0) {
            const trimmed = buffer.trim()
            if (trimmed) {
                if (trimmed.startsWith("@import")) headers.push(trimmed + (char === ";" ? ";" : ""))
                else {
                    const parts = buffer.split(":")
                    if (parts.length >= 2) {
                        const key = parts[0].trim(), val = parts.slice(1).join(":").trim()
                        if (key.startsWith("--")) {
                            const varName = mapProp(key.substring(2), true)
                            let mappedVal = mapValue(val)
                            if (varName.toLowerCase().includes("shadow")) mappedVal = mapPropValue("boxShadow", val)
                            vars.push(`${"    ".repeat(depth + 1)}${varName}: ${mappedVal}`)
                        } else {
                            props.push(`${"    ".repeat(depth)}${mapProp(key, !!options.camelCase)}: ${mapPropValue(key, val)}`)
                        }
                    }
                }
            }
            buffer = ""
        } else buffer += char
    }
    if (buffer.trim()) {
        const trimmed = buffer.trim()
        if (trimmed.startsWith("@import")) headers.push(trimmed)
        else {
            const parts = buffer.split(":")
            if (parts.length >= 2) {
                const key = parts[0].trim(), val = parts.slice(1).join(":").trim()
                if (key.startsWith("--")) {
                    const varName = mapProp(key.substring(2), true)
                    let mappedVal = mapValue(val)
                    if (varName.toLowerCase().includes("shadow")) mappedVal = mapPropValue("boxShadow", val)
                    vars.push(`${"    ".repeat(depth + 1)}${varName}: ${mappedVal}`)
                } else props.push(`${"    ".repeat(depth)}${mapProp(key, !!options.camelCase)}: ${mapPropValue(key, val)}`)
            }
        }
    }
    let js = "{\n"
    if (headers.length === 1) js += `${"    ".repeat(depth)}initheader: ${JSON.stringify(headers[0])},\n`
    else if (headers.length > 1) js += `${"    ".repeat(depth)}initheader: [${headers.map(h => JSON.stringify(h)).join(", ")}],\n`
    if (vars.length > 0) (js += `${"    ".repeat(depth)}vars: {\n`, js += vars.join(",\n") + ",\n", js += `${"    ".repeat(depth)}},\n`)
    if (props.length > 0) js += props.join(",\n") + ",\n"
    if (children.length > 0) js += children.join(",\n") + ",\n"
    return js + `${"    ".repeat(depth - 1)}}`
}

/** 6. Funciones Estándar y Clases */
/** Función principal de traducción */ export function traductor(css: string, options: TOptions = { camelCase: true }): string {
    css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim()
    const body = parseBlock(css, 1, options)
    return `$ => (${body})`
}

/** Función inversa: JS string a CSS string */ export function translateToCSS(js: string): string {
    try {
        let evaluated = eval(js)
        if (typeof evaluated === 'function') {
            const originalFn = evaluated
            evaluated = (helpers: any) => ({ ...originalFn(helpers), pretty: true })
        } else if (typeof evaluated === 'object' && evaluated !== null) {
            evaluated = { ...evaluated, pretty: true }
        }
        return toCSS(evaluated)
    } catch (error) {
        console.error("Error en translateToCSS:", error)
        return ""
    }
}