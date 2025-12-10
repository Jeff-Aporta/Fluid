import { toCSS } from "./toCSS"

/** 2. Types */
type TOptions = { camelCase?: boolean }

/** 4. Variables del Módulo */
const HELPERS = ["flex", "block", "none", "inline", "inline-block", "grid", "relative", "absolute", "fixed", "sticky", "static", "center", "left", "right", "top", "bottom", "pointer", "hidden", "visible", "transparent", "uppercase", "lowercase", "capitalize", "nowrap", "wrap", "solid", "dashed", "dotted", "flex-start", "flex-end", "space-between", "space-around", "space-evenly", "column", "row", "column-reverse", "row-reverse", "antialiased", "touch", "normal", "unset", "initial", "inherit"]
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

    if (val.startsWith("max(") || val.startsWith("min(")) {
        const fn = val.startsWith("max(") ? "max" : "min"
        const content = val.slice(4, -1), parts = splitByComma(content).map(mapValue)
        return `$.${fn}(${parts.join(", ")})`
    }

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

    if (val.endsWith("vw") && REGEX_NUM.test(val.replace("vw", ""))) return `$.vw(${val.replace("vw", "")})`
    if (val.endsWith("vh") && REGEX_NUM.test(val.replace("vh", ""))) return `$.vh(${val.replace("vh", "")})`
    if (val.endsWith("%") && REGEX_NUM.test(val.replace("%", ""))) return `$.percent(${val.replace("%", "")})`
    if (val.endsWith("ms") && REGEX_NUM.test(val.replace("ms", ""))) return `$.ms(${val.replace("ms", "")})`
    if (val.endsWith("s") && REGEX_NUM.test(val.replace("s", ""))) return `$.s(${val.replace("s", "")})`
    if (val.endsWith("deg") && REGEX_NUM.test(val.replace("deg", ""))) return `$.deg(${val.replace("deg", "")})`
    if (val.endsWith("rem") && REGEX_NUM.test(val.replace("rem", ""))) return `$.rem(${val.replace("rem", "")})`
    if (val.endsWith("em") && REGEX_NUM.test(val.replace("em", ""))) return `$.em(${val.replace("em", "")})`
    if (val.startsWith("#")) return `"${val}"`
    if (val.startsWith("rgba(")) {
        const parts = val.slice(5, -1).split(",").map(s => s.trim())
        return parts.length === 4 && parts[0] === parts[1] && parts[1] === parts[2] ? `$.rgba(${parts[0]}, ${parts[3]})` : `$.rgba(${parts.join(", ")})`
    }
    if (val.startsWith("rgb(")) return `$.rgb(${val.slice(4, -1).split(",").map(s => s.trim()).join(", ")})`
    if (val.startsWith("url(")) return `$.url("${val.replace("url(", "").replace(")", "").replace(/['"]/g, "")}")`
    if (val.startsWith("var(")) return `$.cssVar("${val.slice(4, -1).replace(/^--/, "")}")`
    if (val.startsWith("calc(")) {
        const content = val.slice(5, -1).trim()
        return `$.calc(${parseCalc(content)})`
    }
    return `"${val}"`
}

const parseCalc = (expr: string): string => {
    expr = expr.trim()
    // Handle parentheses grouping: ( ... )
    if (expr.startsWith("(") && expr.endsWith(")")) {
        // Verify these parens are actually a wrapper for the whole expression and not just part of it
        // scan to find matching close paren
        let depth = 0, matched = false
        for (let i = 0; i < expr.length; i++) {
            if (expr[i] === "(") depth++
            else if (expr[i] === ")") {
                depth--
                if (depth === 0) {
                    if (i === expr.length - 1) matched = true
                    break
                }
            }
        }
        if (matched) return `$.group(${parseCalc(expr.slice(1, -1))})`
    }

    // Split by operators with precedence: +, - have lower precedence (split first to build tree bottom-up)
    const operators = [["+", "-"], ["*", "/"]]

    for (const ops of operators) {
        let depth = 0
        // standard CSS calc requires spaces around + and - but let's be flexible or assume valid CSS
        // we iterate from the end to associativity (left-to-right) -> actually for split we want the last operator to be the root
        for (let i = expr.length - 1; i >= 0; i--) {
            const char = expr[i]
            if (char === ")") depth++
            else if (char === "(") depth--
            else if (depth === 0) {
                // Check for operator. For +/- it must be surrounded by space in CSS calc often, but regex logic is safer
                // We simply check if char is in ops.
                // We need to avoid confusing negative numbers "-5px" with subtraction.
                // A binary operator usually has space or is * /
                if (ops.includes(char)) {
                    // Extra check for +/-: if it's - and preceding char is operator or start, it's unary (number sign)
                    // Simple heuristic: check if strictly surrounded by spaces if + or -. 
                    // Or just check if there is a Right Hand Side. 
                    // In valid CSS calc, " - " is substraction, "-5" is negative.
                    const isAddSub = (char === "+" || char === "-")
                    const isSpaceAround = /\s/.test(expr[i - 1] || "") && /\s/.test(expr[i + 1] || "")

                    if (!isAddSub || isSpaceAround) {
                        const left = expr.slice(0, i).trim()
                        const right = expr.slice(i + 1).trim()
                        const opName = char === "+" ? "add" : char === "-" ? "sub" : char === "*" ? "mult" : "div"
                        return `$.${opName}(${parseCalc(left)}, ${parseCalc(right)})`
                    }
                }
            }
        }
    }

    // If no operators found at this level, it's a value
    if (REGEX_PX.test(expr)) return `$.px(${expr.replace("px", "")})`
    return mapValue(expr)
}
const parseMediaFeature = (feature: string) => {
    // Remove outer parens
    const content = feature.replace(/^\(|\)$/g, "").trim()

    // Case 1: Standard min/max-width: val
    const stdMatch = content.match(/^(min|max)-(width|height)\s*:\s*(\d+(?:px|em|rem|%)?)$/)
    if (stdMatch) {
        return { dim: stdMatch[2], type: stdMatch[1], val: stdMatch[3] }
    }

    // Case 2: Range Level 4: width <= val, val < width, etc.
    // Normalized to: dim op val OR val op dim
    // We only handle simple linear ones here. Range "min < width < max" handled separately or via 'and' composition?
    // User mentions "invalida sintaxis (500px < width < 900px)". So we focus on "width <= 500px" style.

    // width <= 500px
    const directMatch = content.match(/^(width|height)\s*([<>=]+)\s*(\d+(?:px|em|rem|%)?)$/)
    if (directMatch) {
        const op = directMatch[2]
        const type = op.includes(">") ? "min" : "max" // > is min-bound, < is max-bound
        return { dim: directMatch[1], type, val: directMatch[3] }
    }

    // 500px <= width
    const reverseMatch = content.match(/^(\d+(?:px|em|rem|%)?)\s*([<>=]+)\s*(width|height)$/)
    if (reverseMatch) {
        const op = reverseMatch[2]
        const type = op.includes("<") ? "min" : "max" // 500 < width  => width > 500 => min-bound
        return { dim: reverseMatch[3], type, val: reverseMatch[1] }
    }

    return null
}

const mapPropValue = (prop: string, val: string): string => {
    const camelProp = prop.replace(REGEX_KEBAB, (_, c) => c.toUpperCase())

    if (val.toLowerCase().endsWith("!important")) {
        const cleanVal = val.replace(/\s*!important$/i, "").trim()
        return `$.important(${mapPropValue(prop, cleanVal)})`
    }

    if (camelProp === "background") {
        const parts = splitByComma(val).map(mapValue)
        return parts.length > 1 ? `$.background(${parts.join(", ")})` : parts[0]
    }
    if (camelProp === "padding" || camelProp === "margin") {
        const rawParts = val.split(/\s+(?![^(]*\))/).map(v => v.trim())
        const parts = rawParts.map(mapValue)

        const unitSet = new Set<string>()
        const values: string[] = []
        let consistent = true 
    
        for (const part of parts) {
            if (part === "0" || part === "$.auto" || part === "$.inherit" || part.startsWith('"') || part.startsWith("'")) {
                values.push(part)
                continue
            }
            const match = part.match(/^\$\.([a-zA-Z]+)\((.*)\)$/)
            if (match) {
                const unit = match[1]
                const val = match[2]
                if (unitSet.size > 0 && !unitSet.has(unit)) {
                    consistent = false; break
                }
                unitSet.add(unit)
                values.push(val)
            } else if (/^-?\d+(\.\d+)?$/.test(part)) {
                // Raw number, compatible with any unit if we treat it as value
                values.push(part)
            } else {
                consistent = false; break
            }
        }

        if (consistent && unitSet.size === 1) {
            const unit = Array.from(unitSet)[0]
            if (values.length === 1) return `[${values[0]}, $.${unit}]`
            return `[${values.join(", ")}, $.${unit}]`
        }

        return parts.length === 1 ? parts[0] : `[${parts.join(", ")}]`
    }
    const borderShorthandProps = ["border", "borderTop", "borderBottom", "borderLeft", "borderRight", "borderBlock", "borderInline", "borderBlockStart", "borderBlockEnd", "borderInlineStart", "borderInlineEnd"]
    if (borderShorthandProps.includes(camelProp)) {
        if (val === "0" || val === "0px") return "0"
        const parts = val.split(/\s+(?![^(]*\))/)
        let width = "1", style = '"solid"', color = '"black"', widthFound = false
        parts.forEach(p => {
            if (/^-?\d+(\.\d+)?(px)?$/.test(p)) (width = p.replace("px", ""), widthFound = true)
            else if (["solid", "dashed", "dotted", "none", "hidden", "double", "groove", "ridge", "inset", "outset"].includes(p)) style = `"${p}"`
            else color = mapValue(p)
        })
        const args: string[] = []
        if (width !== "1") args.push(`width: ${width}`)
        if (style !== '"solid"') args.push(`style: ${style}`)
        if (color !== '"black"') args.push(`color: ${color}`)
        return `{ ${args.join(", ")} }`
    }
    if (camelProp === "boxShadow") {
        if (val === "none") return "$.none"
        if (val.startsWith("var(")) return mapValue(val)
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
            return `{ ${args.join(", ")} }`
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
        return `[${parsed.join(", ")}]`
    }
    if (camelProp === "animation") {
        if (val === "none") return "$.none"
        const parsed = splitByComma(val).map(a => {
            const parts = splitBySpace(a)
            let name = "", duration: string | null = null, timing: string | null = null, delay: string | null = null, iter: string | null = null, dir: string | null = null, fill: string | null = null, state: string | null = null
            parts.forEach(p => {
                if (p.endsWith("ms") || p.endsWith("s")) (!duration ? duration = p : delay = p)
                else if (["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].includes(p)) timing = p
                else if (p.startsWith("cubic-bezier")) timing = `$.cubicBezier(${p.match(/cubic-bezier\(([^)]+)\)/)?.[1] ?? ""})`
                else if (["infinite", "normal", "reverse", "alternate", "alternate-reverse"].includes(p) || /^\d+(\.\d+)?$/.test(p)) {
                    // Number can be iteration count if not a time (times have units usually, but iter count is unitless)
                    // But wait, css animation-iteration-count is a number.
                    if (p === "infinite" || /^\d+(\.\d+)?$/.test(p)) iter = p
                    else if (["normal", "reverse", "alternate", "alternate-reverse"].includes(p)) dir = p
                } else if (["none", "forwards", "backwards", "both"].includes(p)) fill = p
                else if (["running", "paused"].includes(p)) state = p
                else name = p
            })
            const args = [`name: "${name}"`]
            if (duration) args.push(`duration: ${(duration as string).startsWith("$.") ? duration : `"${duration}"`}`)
            if (timing && timing !== "ease") args.push(`timing: ${(timing as string).startsWith("$.") ? timing : `"${timing}"`}`)
            if (delay && delay !== "0s" && delay !== "0") args.push(`delay: ${(delay as string).startsWith("$.") ? delay : `"${delay}"`}`)
            if (iter && iter !== "1") args.push(`iter: "${iter}"`)
            if (dir && dir !== "normal") args.push(`dir: "${dir}"`)
            if (fill && fill !== "none") args.push(`fill: "${fill}"`)
            if (state && state !== "running") args.push(`state: "${state}"`)
            return `{ ${args.join(", ")} }`
        })
        return `[${parsed.join(", ")}]`
    }
    if (camelProp === "transform") {
        if (["none", "unset", "initial", "inherit"].includes(val)) return `$.${val}`
        const transforms = val.split(/\s+(?![^(]*\))/).map(t => t.trim())
        let chain = "$.transform()"
        transforms.forEach(t => {
            const match = t.match(REGEX_TRANSFORM)
            if (match) chain += `.${match[1]}(${match[2].split(",").map(a => mapValue(a.trim())).join(", ")})`
        })
        return `${chain}.str()`
    }
    if (camelProp === "fontFamily") return `$.fontFamily(${splitByComma(val).map(f => (f = f.trim(), (f.startsWith('"') || f.startsWith("'")) ? f : `"${f}"`)).join(", ")})`
    if (camelProp === "filter" || camelProp === "backdropFilter") {
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
        return `[${parsed.join(", ")}]`
    }
    const commaParts = splitByComma(val)
    if (commaParts.length > 1 && !val.startsWith('"') && !val.startsWith("'")) return `$.joinComma(${commaParts.map(mapValue).join(", ")})`

    const spaceParts = splitBySpace(val)
    if (spaceParts.length > 1 && !val.startsWith('"') && !val.startsWith("'")) return `$.joinSpace(${spaceParts.map(mapValue).join(", ")})`

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
    let lastHelper: { type: string, dim: string, val?: string, min?: string, max?: string, hasElseLow?: boolean } | null = null

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

            // Media Query Detection for Helpers
            // Media Query Detection for Helpers
            const features: { [key: string]: { min?: string, max?: string } } = {}

            // 1. Check for Range Syntax (Level 4 complex)
            const rangeMatch = selector.match(/\((\d+(?:px|em|rem|%)?)\s*([<>=]+)\s*(width|height)\s*([<>=]+)\s*(\d+(?:px|em|rem|%)?)\)/)
            if (rangeMatch) {
                const [, val1, op1, dim, op2, val2] = rangeMatch
                // 500 < width < 900
                // val1 op1 dim => 500 < width => width > 500 => min
                // dim op2 val2 => width < 900 => max
                if (op1.includes("<")) features[dim] = { ...features[dim], min: val1 }
                else if (op1.includes(">")) features[dim] = { ...features[dim], max: val1 }

                if (op2.includes("<")) features[dim] = { ...features[dim], max: val2 }
                else if (op2.includes(">")) features[dim] = { ...features[dim], min: val2 }
            }

            // 2. Parsed standard features
            const parts = selector.split(/\s+and\s+/)
            parts.forEach(part => {
                const feat = parseMediaFeature(part)
                if (feat) {
                    if (feat.type === "min") features[feat.dim] = { ...features[feat.dim], min: feat.val }
                    else if (feat.type === "max") features[feat.dim] = { ...features[feat.dim], max: feat.val }
                }
            })

            // Determine Helper
            let helper: string | null = null
            let args: string[] = []
            let dim: string = ""

            if (features.width) {
                dim = "width"
                if (features.width.min && features.width.max) {
                    helper = "btww"; args = [REGEX_PX.test(features.width.min) ? features.width.min.replace("px", "") : `"${features.width.min}"`, REGEX_PX.test(features.width.max) ? features.width.max.replace("px", "") : `"${features.width.max}"`]
                } else if (features.width.min) {
                    helper = "gtw"; args = [REGEX_PX.test(features.width.min) ? features.width.min.replace("px", "") : `"${features.width.min}"`]
                } else if (features.width.max) {
                    helper = "ltw"; args = [REGEX_PX.test(features.width.max) ? features.width.max.replace("px", "") : `"${features.width.max}"`]
                }
            } else if (features.height) {
                dim = "height"
                if (features.height.min && features.height.max) {
                    helper = "btwh"; args = [REGEX_PX.test(features.height.min) ? features.height.min.replace("px", "") : `"${features.height.min}"`, REGEX_PX.test(features.height.max) ? features.height.max.replace("px", "") : `"${features.height.max}"`]
                } else if (features.height.min) {
                    helper = "gth"; args = [REGEX_PX.test(features.height.min) ? features.height.min.replace("px", "") : `"${features.height.min}"`]
                } else if (features.height.max) {
                    helper = "lth"; args = [REGEX_PX.test(features.height.max) ? features.height.max.replace("px", "") : `"${features.height.max}"`]
                }
            }

            if (helper) {
                let merged = false
                if (children.length > 0 && lastHelper) {
                    const isLt = helper === "ltw" || helper === "lth"
                    const numVal = args[0] // For btww matches, we check specific props

                    if (((lastHelper.type === "ltw" || lastHelper.type === "lth") && (helper === "gtw" || helper === "gth")) ||
                        ((lastHelper.type === "gtw" || lastHelper.type === "gth") && (helper === "ltw" || helper === "lth"))) {
                        if (lastHelper.val === numVal && lastHelper.dim === dim) {
                            const last = children.pop()!
                            children.push(last.replace(/\}\)$/, `}, ${childBody})`))
                            merged = true
                            lastHelper = null
                        }
                    } else if (lastHelper.type === "btww" || lastHelper.type === "btwh") {
                        if (dim === lastHelper.dim) { // Ensure same dimension
                            if (isLt && lastHelper.min === numVal && !lastHelper.hasElseLow) {
                                const last = children.pop()!
                                children.push(last.replace(/\}\)$/, `}, ${childBody})`))
                                lastHelper.hasElseLow = true
                                merged = true
                            } else if (!isLt && lastHelper.max === numVal) {
                                const last = children.pop()!
                                const suffix = lastHelper.hasElseLow ? `}, ${childBody})` : `}, null, ${childBody})`
                                children.push(last.replace(/\}\)$/, suffix))
                                merged = true
                                lastHelper = null
                            }
                        }
                    }
                }

                if (!merged) {
                    children.push(`...$.${helper}(${args.join(", ")}, ${childBody})`)
                    if (helper.startsWith("btw")) {
                        lastHelper = { type: helper, dim, min: args[0], max: args[1], hasElseLow: false }
                    } else {
                        lastHelper = { type: helper, dim, val: args[0] }
                    }
                }
            } else {
                const key = /[^a-zA-Z0-9_]/.test(selector) ? `"${selector}"` : selector
                children.push(`${key}: ${childBody}`)
                lastHelper = null
            }
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
                            vars.push(`${varName}: ${mappedVal}`)
                        } else {
                            props.push(`${mapProp(key, !!options.camelCase)}: ${mapPropValue(key, val)}`)
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
                    vars.push(`${varName}: ${mappedVal}`)
                } else props.push(`${mapProp(key, !!options.camelCase)}: ${mapPropValue(key, val)}`)
            }
        }
    }
    const inlineParts: string[] = []
    const blockParts: string[] = []

    const normalProps: string[] = []
    const importantProps: string[] = []

    props.forEach(p => {
        const colonIndex = p.indexOf(":")
        const key = p.substring(0, colonIndex).trim()
        const val = p.substring(colonIndex + 1).trim()
        if (val.startsWith("$.important(") && val.endsWith(")")) {
            importantProps.push(`${key}: ${val.slice(12, -1)}`)
        } else {
            normalProps.push(p)
        }
    })

    if (normalProps.length > 0) inlineParts.push(normalProps.join(", "))
    if (importantProps.length > 0) inlineParts.push(`...$.important({ ${importantProps.join(", ")} })`)

    if (headers.length === 1) blockParts.push(`initheader: ${JSON.stringify(headers[0])}`)
    else if (headers.length > 1) blockParts.push(`initheader: [${headers.map(h => JSON.stringify(h)).join(", ")}]`)

    if (vars.length > 0) {
        blockParts.push(`vars: { ${vars.map(v => v.trim().replace(/^vars:\s*/, "")).join(", ")} }`)
    }

    if (children.length > 0) {
        blockParts.push(...children)
    }

    let js = "{"
    if (inlineParts.length > 0) js += " " + inlineParts.join(", ")

    if (blockParts.length > 0) {
        if (inlineParts.length > 0) js += ","
        js += "\n" + blockParts.map(b => "    ".repeat(depth) + b).join(",\n") + "\n" + "    ".repeat(depth - 1)
    } else {
        js += " "
    }
    js += "}"

    return js
}

/** 6. Funciones Estándar y Clases */
/** Función principal de traducción */ export function traductor(css: string, options: TOptions = { camelCase: true }): string {
    css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim()
    const body = parseBlock(css, 1, options)
    return `$ => (${body})`
}

/** Función inversa: JS string a CSS string */ export function translateToCSS(js: string): string {
    try {
        let evaluated = new Function("return " + js)()
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