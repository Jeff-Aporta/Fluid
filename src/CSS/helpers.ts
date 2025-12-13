/** 1. Imports */
import type { TStrNum } from "@components/ui/ts/constantes"
import type { TSombraVal, TStrNumUnd } from "@components/ui/superficies/Div/Div.types"
import type { Expr, THelpers } from "./types"
import { buildStyle } from "./toCSS"
import { lerp, clamp, porcentajeEnRango, mapear, random, randomElemento, randomEntero, enRango, distancia } from "@components/ui/utilidades/ts/matematicas"
/** 2. Types */
export type TColorOps = typeof COLOR_OPS
/** 4. Variables del Módulo */
export const CSS_ATTRS_NUMBER: readonly string[] = ["z-index", "scale", "opacity", "line-height", "flex-grow", "font-weight"]
export const HTML_TAGS: readonly string[] = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"]
/** 5. Arrow Functions */
/** Ayudante de unidades */ const u = (val: TStrNum) => new UnitValue(val)
/** Crea operacion */ const createOp = (op: string) => (...args: (Expr | TStrNum)[]) => new Operation(op, args)
/** Interpola valores */ const clampCss = (min: number, max: number, unit: string, minView = 400, maxView = 1100, axis: 'w' | 'h' = 'w') => `clamp(${Math.min(min, max)}${unit}, calc(${min}${unit} + (${max} - ${min}) * ((${cssVar({ [axis === 'w' ? 'windowWidth' : 'windowHeight']: axis === 'w' ? "100vw" : "100vh" })} - ${minView}px) / (${maxView} - ${minView}))), ${Math.max(min, max)}${unit})`
/** Clamp width */ export const clampwcss = (min: number, max: number, unit: string, minW = 400, maxW = 1100) => clampCss(min, max, unit, minW, maxW, 'w')
/** Clamp height */ export const clamphcss = (min: number, max: number, unit: string, minH = 400, maxH = 1100) => clampCss(min, max, unit, minH, maxH, 'h')
/** Infiere unidad */ const inferUnit = (val: TStrNum, unit: string = "%") => typeof val === "number" ? `${val}${unit}` : val.endsWith(unit) ? val : `${val}${unit}`
/** Agrega sufijo si es numero */ const addSufix = (v: TStrNum, sufix: string) => {
    if (typeof v === 'number') return `${v}${sufix}`
    if (typeof v === 'string') { if (v.endsWith(sufix)) return v; if (sufix.trim() === "!important") return `${v}${sufix}`; if (/^-?\d+(\.\d+)?$/.test(v)) return `${v}${sufix}` }
    return v
}
/** Ayudante generico para espaciado */ export const join = (...args: any[]) => {
    let values = args, separator = ' ', unitFn = (v: any) => v
    if (Array.isArray(args[0]) && args.length <= 3) {
        values = args[0]; if (args[1]) separator = args[1]
    }
    if (typeof values[values.length - 1] === 'function') { unitFn = values.pop()!; }
    return values.map(v => typeof v === 'number' ? (v === 0 ? '0' : unitFn(v)) : v).join(separator)
}
/** 6. Funciones Estándar y Clases */
export class Channel implements Expr {
    constructor(public name: string, public preferredUnit?: string) { }
    resolve() { return this.name /** retorna nombre del canal */ }
    toString() { return this.resolve() /** retorna nombre del canal (Wrapper de resolve [invocacion implicita]) */ }
}
export class UnitValue implements Expr {
    constructor(public value: TStrNum) { }
    resolve(ctxUnit?: string) { return `${this.value}${ctxUnit || ""}` /** retorna valor concatenado con unidad */ }
    toString() { return String(this.value) /** retorna valor como texto */ }
}
export class Operation implements Expr {
    constructor(public op: string, public args: (Expr | TStrNum)[]) { }
    resolve(ctxUnit?: string): string {
        let unit = ctxUnit
        if (!unit) for (const arg of this.args) {
            if (arg instanceof Channel && arg.preferredUnit) { unit = arg.preferredUnit; break } /** unidad encontrada */
            if (arg instanceof Operation) { const u = arg.findUnit(); if (u) { unit = u; break } } /** unidad encontrada en anidacion */
        }
        return this.args.map(arg => (typeof arg === 'object' && arg !== null && 'resolve' in arg) ? (arg as Expr).resolve(unit) : String(arg)).join(` ${this.op} `) /** resuelve argumentos y une con operador */
    }
    findUnit(): string | undefined {
        for (const arg of this.args) {
            if (arg instanceof Channel && arg.preferredUnit) return arg.preferredUnit /** unidad preferida del canal */
            if (arg instanceof Operation) { const u = arg.findUnit(); if (u) return u } /** unidad preferida anidada */
        }
        return /** sin unidad */
    }
    toString() { return this.resolve() /** retorna resultado de operacion (Wrapper de resolve [invocacion implicita]) */ }
}
// Group class removed as per user request to simplify group helper
export const group = (arg: Expr | TStrNum) => `(${arg})`
/** 7. Objects */
/** Operadores Matematicos Explicitos */
export const add = createOp("+"); export const sub = createOp("-"); export const mult = createOp("*"); export const div = createOp("/")
export const addagr = (...args: (Expr | TStrNum)[]) => group(add(...args)); export const subagr = (...args: (Expr | TStrNum)[]) => group(sub(...args));
export const multagr = (...args: (Expr | TStrNum)[]) => group(mult(...args)); export const divagr = (...args: (Expr | TStrNum)[]) => group(div(...args));
export const COLOR_OPS = {
    /** Canales HSL */ h: new Channel("h", "deg"), s: new Channel("s", "%"), l: new Channel("l", "%"),
    /** Canales RGB */ r: new Channel("r"), g: new Channel("g"), b: new Channel("b"), a: new Channel("alpha"),
    /** Maximos */ rgbMax: "255",
    /** Utilidades */ u,
    /** Operadores */ add, sub, mult, div,
    /** Operadores Agrupados */ addagr, subagr, multagr, divagr
}
/** 7. Exports */
/** Genera variable CSS */ export const cssVar = (name: TStrNum | Record<string, TStrNum>, ...strs: string[]) => {
    if (typeof name === "object") {
        const [key, fallback] = Object.entries(name)[0]
        return `var(--${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}${fallback ? `, ${fallback}` : ""})` /** variable css con fallback opcional */
    }
    return `var(--${[name, ...strs].map(s => String(s).replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)).join("-")})` /** variable css simple */
}
/** Interpola valores */ export const lerpcss = (props: { from?: { value: number | [number, number], width?: number }, to?: { value: number | [number, number], width?: number }, min?: number | [number, number], max?: number | [number, number], unit?: string }) => {
    const { from, to, min, max, unit = "px" } = props;
    const v1 = from?.value ?? min; const v2 = to?.value ?? max;
    const w1 = from?.width ?? 400; const w2 = to?.width ?? 1100;
    if (v1 === undefined || v2 === undefined) return "";
    return (Array.isArray(v1) && Array.isArray(v2)) ? `${clampCss(v1[0], v2[0], unit, w1, w2)} ${clampCss(v1[1], v2[1], unit, w1, w2)}` : clampCss(v1 as number, v2 as number, unit, w1, w2)
}
/** Interpola valores (Height) */ export const lerphcss = (props: { from?: { value: number | [number, number], height?: number }, to?: { value: number | [number, number], height?: number }, min?: number | [number, number], max?: number | [number, number], unit?: string }) => {
    const { from, to, min, max, unit = "px" } = props;
    const v1 = from?.value ?? min; const v2 = to?.value ?? max;
    const h1 = from?.height ?? 400; const h2 = to?.height ?? 1100;
    if (v1 === undefined || v2 === undefined) return "";
    return (Array.isArray(v1) && Array.isArray(v2)) ? `${clampCss(v1[0], v2[0], unit, h1, h2, 'h')} ${clampCss(v1[1], v2[1], unit, h1, h2, 'h')}` : clampCss(v1 as number, v2 as number, unit, h1, h2, 'h')
}

/** Aliases amigables */
export const clampw = clampwcss; export const clamph = clamphcss;
export const lerpw = lerpcss; export const lerph = lerphcss;
/** Genera color HSL */ export const hsl = (h: TStrNum, s: TStrNum, l: TStrNum, a?: TStrNum) => a !== undefined ? `hsla(${h}, ${inferUnit(s)}, ${inferUnit(l)}, ${a})` : `hsl(${h}, ${inferUnit(s)}, ${inferUnit(l)})` /** color hsl o hsla */
/** Genera color RGB */ export const rgb = (...args: TStrNum[]) => args.length === 1 ? `rgb(${args[0]}, ${args[0]}, ${args[0]})` : args.length === 2 ? `rgba(${args[0]}, ${args[0]}, ${args[0]}, ${args[1]})` : args.length === 3 ? `rgb(${args[0]}, ${args[1]}, ${args[2]})` : `rgba(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]})` /** color rgb o rgba */
/** Genera color RGBA (alias inteligente) */ export const rgba = (...args: number[]) => {
    if (args.length === 2) return `rgba(${args[0]}, ${args[0]}, ${args[0]}, ${args[1]})` /** gris con transparencia */
    if (args.length === 4) return `rgba(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]})` /** color completo con transparencia */
    return `rgba(${args.join(', ')})` /** fallback */
}
/** Genera gradiente lineal */ export const linearGradient = (dir: string | number | { dir?: string | number, to?: string, stops: (string | [string, number])[] }, stops?: (string | [string, number])[]) => {
    let direction = "0deg", colorStops: (string | [string, number])[] = []
    if (typeof dir === 'object' && !Array.isArray(dir)) {
        if (dir.to) direction = `to ${dir.to}`
        else direction = typeof dir.dir === 'number' ? `${dir.dir}deg` : dir.dir || "0deg"
        colorStops = dir.stops
    } else { direction = typeof dir === 'number' ? `${dir}deg` : dir as string; colorStops = stops || [] }
    const formattedStops = colorStops.map(s => Array.isArray(s) ? `${s[0]} ${s[1]}%` : s).join(', ')
    return `linear-gradient(${direction}, ${formattedStops})` /** retorna gradiente lineal */
}
/** Genera gradiente radial */ export const radialGradient = (shape: string | { shape?: string, at?: string | { x: number, y: number }, stops: (string | [string, number])[] }, stops?: (string | [string, number])[]) => {
    let shapeStr = "", colorStops: (string | [string, number])[] = []
    if (typeof shape === 'object' && !Array.isArray(shape)) {
        const { shape: s = "circle", at, stops: st } = shape; let atStr = ""
        if (at) { if (typeof at === 'object') atStr = ` at ${typeof at.x === 'number' ? `${at.x}px` : at.x} ${typeof at.y === 'number' ? `${at.y}px` : at.y}`; else atStr = ` at ${at}` }
        shapeStr = `${s}${atStr}`; colorStops = st
    } else { shapeStr = shape as string; colorStops = stops || [] }
    const formattedStops = colorStops.map(s => Array.isArray(s) ? `${s[0]} ${s[1]}%` : s).join(', ')
    return `radial-gradient(${shapeStr}, ${formattedStops})` /** retorna gradiente radial */
}
/** Genera fondo multiple */ export const background = (...args: string[]) => args.join(', ')
/** Genera familia de fuentes */ export const font = (...families: string[]) => families.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')
/** Genera margen */ export const margin = (...args: any[]) => typeof args[args.length - 1] === 'function' ? join(...args) : join(...args, px)
/** Genera relleno */ export const padding = (...args: any[]) => typeof args[args.length - 1] === 'function' ? join(...args) : join(...args, px)
/** Une con espacio */ export const joinSpace = (...args: any[]) => join(args, ' ')
/** Une con coma */ export const joinComma = (...args: any[]) => join(args, ', ')
/** Genera modo claro-oscuro */ export const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`
/** Genera calculo */ export const calc = (expr: Expr | string) => `calc(${typeof expr === 'object' && 'resolve' in expr ? expr.resolve() : expr})`
/** Genera maximo */ export const max = (...args: (Expr | TStrNum)[]) => `max(${args.map(a => typeof a === 'object' && 'resolve' in a ? a.resolve() : typeof a === 'number' ? `${a}px` : a).join(', ')})`
/** Genera minimo */ export const min = (...args: (Expr | TStrNum)[]) => `min(${args.map(a => typeof a === 'object' && 'resolve' in a ? a.resolve() : typeof a === 'number' ? `${a}px` : a).join(', ')})`
/** Genera URL */ export const url = (path: string) => `url("${path}")`
/** Genera formato */ export const format = (fmt: string) => `format("${fmt}")`
/** Genera HSL desde componentes */ export const hslFrom = (fn: (cols: TColorOps, uHelper: typeof u) => (Expr | TStrNum | ((ops: TColorOps, uHelper: typeof u) => Expr | TStrNum))[]) => {
    const [base, h, s, l, a] = fn(COLOR_OPS, u)
    const resolve = (v: any, unit?: string): TStrNum => {
        if (typeof v === 'function') return `calc(${resolve(v(COLOR_OPS, u), unit)})` /** llamada recursiva a calc */
        if (typeof v === 'object' && v !== null && 'resolve' in v) return v.resolve(unit) /** resolucion de objeto expresion */
        return (typeof v === 'number' && unit) ? `${v}${unit}` : v /** valor primitivo con unidad opcional */
    }
    const _a = a !== undefined ? resolve(a) : undefined
    return _a !== undefined ? `hsl(from ${base} ${resolve(h, "deg")} ${resolve(s, "%")} ${resolve(l, "%")} / ${_a})` : `hsl(from ${base} ${resolve(h, "deg")} ${resolve(s, "%")} ${resolve(l, "%")})` /** color hsl relativo */
}
/** Genera RGB desde componentes */ export const rgbFrom = (fn: (cols: TColorOps, uHelper: typeof u) => (Expr | TStrNum | ((ops: TColorOps, uHelper: typeof u) => Expr | TStrNum))[]) => {
    const [base, r, g, b, a] = fn(COLOR_OPS, u)
    const resolve = (v: any, unit?: string): TStrNum => {
        if (typeof v === 'function') return `calc(${resolve(v(COLOR_OPS, u), unit)})` /** llamada recursiva a calc */
        if (typeof v === 'object' && v !== null && 'resolve' in v) return v.resolve(unit) /** resolucion de objeto expresion */
        return (typeof v === 'number' && unit) ? `${v}${unit}` : v /** valor primitivo con unidad opcional */
    }
    const _a = a !== undefined ? resolve(a) : undefined
    return _a !== undefined ? `rgb(from ${base} ${resolve(r)} ${resolve(g)} ${resolve(b)} / ${_a})` : `rgb(from ${base} ${resolve(r)} ${resolve(g)} ${resolve(b)})` /** color rgb relativo */
}
/** Genera borde */ export const border = ({ width = 1, style = "solid", color = "black" }: { width?: TStrNum; style?: string; color?: string } = {}) => {
    if (style === "none") return "none"
    const parts = []
    parts.push(typeof width === "number" ? `${width}px` : width)
    parts.push(style)
    parts.push(color)
    return parts.join(" ")
}
/** Convierte sombra */ export const convertBoxShadow = (val: TSombraVal): string => {
    if (!val) return "" /** cadena vacia */
    if (typeof val === 'string') return val /** valor como string */
    if (Array.isArray(val)) return val.map(convertBoxShadow).join(', ') /** array de sombras unido */
    const { dX = 0, dY = 0, blur = 0, spread = 0, color = "black", inset } = val
    const px = (v: TStrNumUnd) => typeof v === 'number' ? `${v}px` : v || "0"
    return `${inset ? "inset " : ""}${px(dX)} ${px(dY)} ${px(blur)} ${px(spread)} ${color}` /** sombra completa formateada */
}
/** Genera transicion */ export const transition = (...props: (Record<string, number | { time: TStrNum, bezier?: number[] }> | (string | { prop: string, time: number | string, ease?: string, delay?: number | string }) | (string | { prop: string, time: number | string, ease?: string, delay?: number | string })[])[]): string => {
    let args = props
    if (props.length === 1 && Array.isArray(props[0])) args = props[0] as any
    else if (props.length === 1 && typeof props[0] === 'object' && props[0] !== null && !('prop' in props[0])) {
        return Object.entries(props[0]).map(([prop, val]) => {
            if (typeof val === "number") return `${prop} ${val}s ease` /** transicion simple */
            if (typeof val === "string") return `${prop} ${val} ease` /** transicion simple string */
            const { time, bezier } = val as { time: TStrNum, bezier?: number[] }
            const timeStr = typeof time === "number" ? `${time}s` : time
            return `${prop} ${timeStr} ${bezier ? `cubic-bezier(${bezier.join(", ")})` : "ease"}` /** transicion con cubic-bezier */
        }).join(", ") /** lista de transiciones unida */
    }
    return args.map(a => {
        if (typeof a === 'string') return a
        const { prop, time, ease = 'ease', delay = 0 } = a as { prop: string, time: number | string, ease?: string, delay?: number | string }
        const timeStr = typeof time === 'number' ? `${time}s` : time
        const hasEase = typeof time === 'string' && (time.includes('var(') || time.includes('ease') || time.includes('cubic-bezier'))
        const easeStr = hasEase ? '' : ease
        const delayStr = delay ? (typeof delay === 'number' ? `${delay}s` : delay) : ''
        return `${prop} ${timeStr} ${easeStr} ${delayStr}`.trim()
    }).join(', ')
}
/** Genera animacion */ export const animation = (...props: (string | { name: string, duration?: TStrNum, timing?: string, delay?: TStrNum, iter?: TStrNum, dir?: string, fill?: string, state?: string })[]) => {
    return props.map(p => {
        if (typeof p === 'string') return p
        const { name, duration = "1s", timing = "ease", delay = 0, iter = 1, dir = "normal", fill = "none", state = "running" } = p
        const time = (v: TStrNum) => typeof v === 'number' ? `${v}s` : v
        return `${name} ${time(duration)} ${timing} ${time(delay)} ${iter} ${dir} ${fill} ${state}`
    }).join(', ')
}
/** Genera transformacion */ export const transform = (initial?: Record<string, TStrNum>) => {
    const ops: string[] = []
    const add = (fn: string, val: TStrNum, def: number, unit: string = "") => ops.push(`${fn}(${typeof val === 'number' ? `${val ?? def}${unit}` : val})`)
    const builder = {
        translate: (x: TStrNum, y: TStrNum) => (ops.push(`translate(${typeof x === 'number' ? `${x ?? 0}px` : x}, ${typeof y === 'number' ? `${y ?? 0}px` : y})`), builder), translateX: (v: TStrNum) => (add("translateX", v, 0, "px"), builder), translateY: (v: TStrNum) => (add("translateY", v, 0, "px"), builder), translateZ: (v: TStrNum) => (add("translateZ", v, 0, "px"), builder),
        scale: (v: TStrNum) => (add("scale", v, 1), builder), scaleX: (v: TStrNum) => (add("scaleX", v, 1), builder), scaleY: (v: TStrNum) => (add("scaleY", v, 1), builder),
        rotate: (v: TStrNum) => (add("rotate", v, 0, "deg"), builder), rotateX: (v: TStrNum) => (add("rotateX", v, 0, "deg"), builder), rotateY: (v: TStrNum) => (add("rotateY", v, 0, "deg"), builder),
        skew: (x: TStrNum, y: TStrNum) => (ops.push(`skew(${typeof x === 'number' ? `${x ?? 0}deg` : x}, ${typeof y === 'number' ? `${y ?? 0}deg` : y})`), builder), skewX: (v: TStrNum) => (add("skewX", v, 0, "deg"), builder), skewY: (v: TStrNum) => (add("skewY", v, 0, "deg"), builder),
        str: () => ops.join(" ") /** cadena de transformaciones */
    }
    if (initial) Object.entries(initial).forEach(([k, v]) => k in builder && (builder as any)[k](v))
    return builder /** builder de transformaciones */
}
/** Genera sombra de caja */ export const boxShadow = (...args: TSombraVal[]) => args.map(convertBoxShadow).join(", ")
// join removido de aqui para evitar duplicidad y usar el definido arriba
/** Ayudantes de unidades */
export const em = (val: TStrNum) => addSufix(val, "em"); export const rem = (val: TStrNum) => addSufix(val, "rem"); export const px = (val: TStrNum) => addSufix(val, "px");
export const percent = (val: TStrNum) => addSufix(val, "%"); export const s = (val: TStrNum) => addSufix(val, "s"); export const ms = (val: TStrNum) => addSufix(val, "ms");
export const deg = (val: TStrNum) => addSufix(val, "deg"); export const vh = (val: TStrNum) => addSufix(val, "vh"); export const vw = (val: TStrNum) => addSufix(val, "vw");
export const important = (val: TStrNum | Record<string, any>) => {
    const sfx = " !important";
    if (typeof val === 'object' && val !== null) {
        const res: Record<string, string> = {};
        for (const key in val) {
            let v = val[key]
            if (key === "boxShadow" && typeof v === 'object' && v !== null && !Array.isArray(v)) v = convertBoxShadow(v)
            else if (key === "boxShadow" && Array.isArray(v)) v = v.map(convertBoxShadow).join(", ")
            else if (key.startsWith("border") && typeof v === 'object' && v !== null && !Array.isArray(v) && ("width" in v || "style" in v || "color" in v)) v = border(v)
            res[key] = addSufix(v, sfx)
        }
        return res
    }
    return addSufix(val, sfx)
}
/** Genera curva cubica */ export const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
/** Genera rango */ export const range = (start: number, stop: number, step: number = 1): number[] => Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step)
/** Genera entradas de mapa por rango */ export const rangeMapEntries = <T>(start: number, stop: number, fn: (i: number) => [string, T], step: number = 1): Record<string, T> => {
    const result: Record<string, T> = {}
    for (let i = start; i < stop; i += step) { const [key, value] = fn(i); result[key] = value }
    return result
}
/** Genera familia de fuentes (alias) */ export const fontFamily = font
/** Genera filtro */ export const filter = (...args: string[]) => args.join(' ')
/** Genera sombra paralela */ export const dropShadow = ({ dX = 0, dY = 0, blur = 0, color = "black" }: { dX?: TStrNum; dY?: TStrNum; blur?: TStrNum; color?: string }) => {
    const px = (v: TStrNum) => typeof v === 'number' ? `${v}px` : v; return `drop-shadow(${px(dX)} ${px(dY)} ${px(blur)} ${color})`
}
/** Otros filtros */
const filterUnit = (v: TStrNum, unit: string = "") => typeof v === 'number' ? `${v}${unit}` : v
export const blur = (v: TStrNum) => `blur(${filterUnit(v, "px")})`; export const brightness = (v: TStrNum) => `brightness(${v})`
export const contrast = (v: TStrNum) => `contrast(${v})`; export const grayscale = (v: TStrNum) => `grayscale(${v})`
export const hueRotate = (v: TStrNum) => `hue-rotate(${filterUnit(v, "deg")})`; export const invert = (v: TStrNum) => `invert(${v})`
export const opacity = (v: TStrNum) => `opacity(${v})`; export const saturate = (v: TStrNum) => `saturate(${v})`
export const sepia = (v: TStrNum) => `sepia(${v})`
/** Genera texto entre comillas */ export const text = (val: string) => `'${val}'`
/** 8. Media Query Helpers */
/** Less than width */ export const ltw = (width: TStrNum, then: any, elseVal?: any) => {
    const val = typeof width === 'number' ? `${width}px` : width
    return { [`@media screen and (width <= ${val})`]: buildStyle(then), ...elseVal ? { [`@media screen and (width > ${val})`]: buildStyle(elseVal) } : {} }
}
/** Greater than width */ export const gtw = (width: TStrNum, then: any, elseVal?: any) => {
    const val = typeof width === 'number' ? `${width}px` : width
    return { [`@media screen and (width >= ${val})`]: buildStyle(then), ...elseVal ? { [`@media screen and (width < ${val})`]: buildStyle(elseVal) } : {} }
}
/** Between width */ export const btww = (min: TStrNum, max: TStrNum, then: any, elseVal?: any, elseMax?: any) => {
    const minVal = typeof min === 'number' ? `${min}px` : min; const maxVal = typeof max === 'number' ? `${max}px` : max
    return { [`@media screen and (width >= ${minVal}) and (width <= ${maxVal})`]: buildStyle(then), ...elseVal ? { [`@media screen and (width < ${minVal})`]: buildStyle(elseVal) } : {}, ...elseMax ? { [`@media screen and (width > ${maxVal})`]: buildStyle(elseMax) } : {} }
}
/** Less than height */ export const lth = (height: TStrNum, then: any, elseVal?: any) => {
    const val = typeof height === 'number' ? `${height}px` : height
    return { [`@media screen and (height <= ${val})`]: buildStyle(then), ...elseVal ? { [`@media screen and (height > ${val})`]: buildStyle(elseVal) } : {} }
}
/** Greater than height */ export const gth = (height: TStrNum, then: any, elseVal?: any) => {
    const val = typeof height === 'number' ? `${height}px` : height
    return { [`@media screen and (height >= ${val})`]: buildStyle(then), ...elseVal ? { [`@media screen and (height < ${val})`]: buildStyle(elseVal) } : {} }
}
/** Between height */ export const btwh = (min: TStrNum, max: TStrNum, then: any, elseVal?: any, elseMax?: any) => {
    const minVal = typeof min === 'number' ? `${min}px` : min; const maxVal = typeof max === 'number' ? `${max}px` : max
    return { [`@media screen and (height >= ${minVal}) and (height <= ${maxVal})`]: buildStyle(then), ...elseVal ? { [`@media screen and (height < ${minVal})`]: buildStyle(elseVal) } : {}, ...elseMax ? { [`@media screen and (height > ${maxVal})`]: buildStyle(elseMax) } : {} }
}
/** 9. Main Object */
export const HELPERS: THelpers = {
    /** Display */ none: "none", hidden: "hidden", visible: "visible", absolute: "absolute", relative: "relative", block: "block", inline: "inline", inlineBlock: "inline-block", flex: "flex", grid: "grid",
    /** Flexbox */ column: "column", row: "row", flexEnd: "flex-end", spaceBetween: "space-between", spaceAround: "space-around", spaceEvenly: "space-evenly", wrap: "wrap",
    /** Globales */ auto: "auto", inherit: "inherit", initial: "initial", unset: "unset", transparent: "transparent", currentColor: "currentColor", pointer: "pointer", squareRatio: "1 / 1",
    /** Texto */ normal: "normal", left: "left", center: "center", uppercase: "uppercase", nowrap: "nowrap", dark: "dark", light: "light", thin: "thin",
    /** UI */ notAllowed: "not-allowed", borderBox: "border-box", antialiased: "antialiased", touch: "touch", middle: "middle",
    /** Posicion */ fixed: "fixed", sticky: "sticky", static: "static", flexStart: "flex-start", top: "top", right: "right", bottom: "bottom", topRight: "top right", topLeft: "top left", bottomRight: "bottom right", bottomLeft: "bottom left",
    /** Funciones */ range, rangeMapEntries, transition, animation, transform, boxShadow, convertBoxShadow, border, rgb, rgba, important, cubicBezier, lerpcss, clampwcss, clamphcss, hsl, lightDark, calc, url, format, linearGradient, radialGradient, background, font, fontFamily, margin, padding, join, joinSpace, joinComma, hslFrom, rgbFrom, cssVar, add, sub, mult, div, group, max, min,
    addagr, subagr, multagr, divagr,
    /** Media Query Helpers */ ltw, gtw, btww, lth, gth, btwh,
    /** Unidades */ em, rem, px, percent, s, ms, deg, vh, vw,
    /** Filtros */ filter, dropShadow, blur, brightness, contrast, hueRotate, invert, opacity, saturate, sepia, grayscale,
    /** Utils */ text, lerp: lerpcss /** alias para mejor legibilidad */,
    clampw: clampwcss, clamph: clamphcss, lerpw: lerpcss, lerph: lerphcss,
    /** Matematicas */ math: { lerp, clamp, porcentajeEnRango, mapear, random, randomElemento, randomEntero, enRango, distancia }
}
