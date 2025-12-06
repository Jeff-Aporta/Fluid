/** 1. Imports */
import type { TStrNum } from "@components/ui/ts/constantes"
import type { TSombraVal, TStrNumUnd } from "@components/ui/superficies/Div/Div.types"
import type { Expr, THelpers } from "./types"
import { lerp, clamp, porcentajeEnRango, mapear, random, randomElemento, randomEntero, enRango, distancia } from "@components/ui/utilidades/ts/matematicas"

/** 2. Types */
export type TColorOps = typeof COLOR_OPS

/** 4. Variables del Módulo */
export const CSS_ATTRS_NUMBER: readonly string[] = ["z-index", "scale", "opacity", "line-height", "flex-grow", "font-weight"]
export const HTML_TAGS: readonly string[] = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"]

/** 5. Arrow Functions */
/** Ayudante de unidades */ const u = (val: TStrNum) => new UnitValue(val)
/** Crea operacion */ const createOp = (op: string) => (...args: (Expr | TStrNum)[]) => new Operation(op, args)
/** Clamp para CSS */ const clampCss = (min: number, max: number, unit: string) => `clamp(${min}${unit}, ${min}${unit} + (${max} - ${min}) * ((100vw - 400px) / (1100 - 400)), ${max}${unit})`
/** Infiere unidad */ const inferUnit = (val: TStrNum, unit: string = "%") => typeof val === "number" ? `${val}${unit}` : val.endsWith(unit) ? val : `${val}${unit}`
/** Agrega sufijo si es numero */ const addSufix = (v: TStrNum, sufix: string) => {
    if (typeof v === 'number') return `${v}${sufix}`
    if (typeof v === 'string') { if (v.endsWith(sufix)) return v; if (sufix.trim() === "!important") return `${v}${sufix}`; if (/^-?\d+(\.\d+)?$/.test(v)) return `${v}${sufix}` }
    return v
}
/** Ayudante generico para espaciado */ const spacingHelper = (args: any[]) => {
    let unitFn = px, values = args
    if (typeof args[args.length - 1] === 'function') { unitFn = args.pop(); values = args }
    return values.map(v => typeof v === 'number' ? (v === 0 ? '0' : unitFn(v)) : v).join(' ')
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

export class Group extends Operation {
    constructor(arg: Expr | TStrNum) { super("", [arg]) }
    resolve(ctxUnit?: string) {
        const arg = this.args[0]
        const val = typeof arg === 'object' && arg !== null && 'resolve' in arg ? (arg as Expr).resolve(ctxUnit) : String(arg) /** resuelve expresion interna */
        return `(${val})` /** retorna expresion agrupada */
    }
}

/** 7. Objects */
const CALC_OPS = {
    /** Operadores */ add: createOp("+"), sub: createOp("-"), mult: createOp("*"), div: createOp("/"),
    /** Agrupacion */ group: (arg: Expr | TStrNum) => new Group(arg)
}

export const COLOR_OPS = {
    ...CALC_OPS,
    /** Canales HSL */ h: new Channel("h", "deg"), s: new Channel("s", "%"), l: new Channel("l", "%"),
    /** Canales RGB */ r: new Channel("r"), g: new Channel("g"), b: new Channel("b"), a: new Channel("alpha"),
    /** Maximos */ rgbMax: "255",
    /** Utilidades */ u
}

/** 7. Exports */
/** Genera variable CSS */ export const cssVar = (name: TStrNum | Record<string, TStrNum>, ...strs: string[]) => {
    if (typeof name === "object") {
        const [key, fallback] = Object.entries(name)[0]
        return `var(--${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}${fallback ? `, ${fallback}` : ""})` /** variable css con fallback opcional */
    }
    return `var(--${[name, ...strs].map(s => String(s).replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)).join("-")})` /** variable css simple */
}
/** Interpola valores */ export const lerpcss = ({ min, max, unit = "px" }: { min: number | [number, number], max: number | [number, number], unit?: string }) => (Array.isArray(min) && Array.isArray(max)) ? `${clampCss(min[0], max[0], unit)} ${clampCss(min[1], max[1], unit)}` : clampCss(min as number, max as number, unit) /** valor interpolado con clamp */
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
/** Genera margen */ export const margin = (...args: any[]) => spacingHelper(args)
/** Genera relleno */ export const padding = (...args: any[]) => spacingHelper(args)
/** Genera modo claro-oscuro */ export const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`
/** Genera calculo */ export const calc = (expr: string | ((ops: typeof COLOR_OPS) => Expr | string)) => `calc(${typeof expr === 'function' ? (res => typeof res === 'object' && 'resolve' in res ? res.resolve() : res)(expr(COLOR_OPS)) : expr})`
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
/** Genera borde */ export const border = ({ width = 1, style = "solid", color = "black" }: { width?: TStrNum; style?: string; color?: string } = {}) => `${typeof width === "number" ? `${width}px` : width} ${style} ${color}`
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
/** Genera sombra de caja */ export const boxShadow = ({ dX = 0, dY = 0, blur = 0, spread = 0, color = "black", inset = false }: { dX?: number; dY?: number; blur?: number; spread?: number; color?: string; inset?: boolean }) => `${inset ? "inset " : ""}${dX}px ${dY}px ${blur}px ${spread}px ${color}`
/** Ayudante de union */ export const join = (...args: any[]) => {
    let config = { separator: ' ', unit: 'px' }, values = args
    if (args.length > 0 && typeof args[args.length - 1] === 'object' && args[args.length - 1] !== null && !Array.isArray(args[args.length - 1])) { config = { ...config, ...args[args.length - 1] }; values = args.slice(0, -1) }
    return values.map(v => { if (typeof v === 'number') { if (v === 0) return '0'; return `${v}${config.unit}` } return v }).join(config.separator)
}
/** Ayudantes de unidades */
export const em = (val: TStrNum) => addSufix(val, "em"); export const rem = (val: TStrNum) => addSufix(val, "rem"); export const px = (val: TStrNum) => addSufix(val, "px");
export const percent = (val: TStrNum) => addSufix(val, "%"); export const s = (val: TStrNum) => addSufix(val, "s"); export const ms = (val: TStrNum) => addSufix(val, "ms");
export const deg = (val: TStrNum) => addSufix(val, "deg"); export const vh = (val: TStrNum) => addSufix(val, "vh"); export const vw = (val: TStrNum) => addSufix(val, "vw");
export const important = (val: TStrNum) => addSufix(val, " !important");
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

/** 8. Main Object */
export const HELPERS: THelpers = {
    /** Display */ none: "none", hidden: "hidden", visible: "visible", absolute: "absolute", relative: "relative", block: "block", inline: "inline", inlineBlock: "inline-block", flex: "flex", grid: "grid",
    /** Globales */ auto: "auto", inherit: "inherit", initial: "initial", unset: "unset", transparent: "transparent", currentColor: "currentColor", pointer: "pointer", squareRatio: "1 / 1",
    /** Texto */ normal: "normal", left: "left", center: "center", uppercase: "uppercase", nowrap: "nowrap", dark: "dark", light: "light", thin: "thin",
    /** UI */ notAllowed: "not-allowed", borderBox: "border-box", antialiased: "antialiased", touch: "touch", middle: "middle",
    /** Posicion */ fixed: "fixed", sticky: "sticky", static: "static", flexStart: "flex-start", top: "top", right: "right", bottom: "bottom", topRight: "top right", topLeft: "top left", bottomRight: "bottom right", bottomLeft: "bottom left",
    /** Funciones */ range, rangeMapEntries, transition, transform, boxShadow, convertBoxShadow, border, rgb, rgba, important, cubicBezier, lerpcss, hsl, lightDark, calc, url, format, linearGradient, radialGradient, background, font, fontFamily, margin, padding, join, hslFrom, rgbFrom, cssVar,
    /** Unidades */ em, rem, px, percent, s, ms, deg, vh, vw,
    /** Filtros */ filter, dropShadow, blur, brightness, contrast, hueRotate, invert, opacity, saturate, sepia, grayscale,
    /** Utils */ text, lerp: lerpcss /** alias para mejor legibilidad */,
    /** Matematicas */ math: { lerp, clamp, porcentajeEnRango, mapear, random, randomElemento, randomEntero, enRango, distancia }
}
