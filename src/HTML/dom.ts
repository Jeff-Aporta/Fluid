/** 1. Imports */
import { toCSS, buildStyle } from "../CSS/toCSS"
import { insertStyle } from "../CSS/insertStyle"
import { HELPERS as CSS_HELPERS } from "../CSS/helpers"
import type { ElementTarget, JSONElement, HTMLElementBuilder } from "./types"
export * from "./types"

/** 2. Variables del Módulo */
const HELPERS = { br: { br: {} }, hr: { hr: {} } }
const REGEX_INVALID_SELECTOR = /[\s>+~]/ /** valida selectores prohibidos */
const REGEX_TEXT_CONTENT = /\{([^\}]+)\}/ /** captura contenido entre llaves */
const REGEX_ATTR_BLOCK = /\[([^\]]+)\]/g /** captura bloque de atributos */
const REGEX_ATTR_PAIR = /([a-zA-Z0-9-_]+)(?:=(?:"([^"]*)"|'([^']*)'|([^ ]*)))?/g /** captura par clave=valor */
const REGEX_TAG = /^([a-zA-Z0-9-]+)/ /** captura etiqueta inicial */
const REGEX_ID = /#([a-zA-Z0-9-_]+)/ /** captura id */
const REGEX_CLASS = /\.([a-zA-Z0-9-_]+)/g /** captura clases */

/** 3. Arrow Functions */
const parseEmmetString = (str: string): HTMLElement => {
    let content = ''
    str = str.replace(REGEX_TEXT_CONTENT, (_, c) => (content = c, ''))
    const attrs: Record<string, string> = {}
    str = str.replace(REGEX_ATTR_BLOCK, (_, attrBlock) => {
        let match
        REGEX_ATTR_PAIR.lastIndex = 0
        while ((match = REGEX_ATTR_PAIR.exec(attrBlock)) !== null) attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? ""
        return ''
    })
    const tagMatch = str.match(REGEX_TAG)
    const el = document.createElement(tagMatch ? tagMatch[0] : 'div')
    const idMatch = str.match(REGEX_ID)
    if (idMatch) el.id = idMatch[1]
    const classMatches = str.match(REGEX_CLASS)
    if (classMatches) el.classList.add(...classMatches.map(c => c.slice(1)))
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
    if (content) el.innerText = content
    return el
}

/** 4. Funciones Estándar y Clases */
class ElementBuilderImpl implements HTMLElementBuilder {
    constructor(private _el: HTMLElement) {
        ["resize", "keydown", "keyup", "mousedown", "mouseup", "mousemove", "drag", "mouseout", "mouseenter", "click", "dblclick", "contextmenu", "touchstart", "touchend"].forEach(ev => {
            (this as any)[ev] = (handler: any) => this.on({ event: ev, handler })
        })
    }
    resume() { return this._el }
    html(val?: string, outer?: boolean) {
        if (typeof val === "string") {
            this._el.innerHTML = val
            return this
        }
        return outer ? this._el.outerHTML : this
    }
    get innerHTML() { return this._el.innerHTML }
    set innerHTML(val: string) { this._el.innerHTML = val }
    appendHtml(val: string) {
        this._el.innerHTML += val
        return this
    }
    text(val?: string) {
        if (val === undefined) return this._el.innerText
        this._el.innerText = val
        return this
    }
    get height() { return this._el.clientHeight }
    get width() { return this._el.clientWidth }
    get x() { return this.rect.left }
    get y() { return this.rect.top }
    get right() { return this.rect.right }
    get bottom() { return this.rect.bottom }
    get scrollY() { return this._el.scrollTop }
    set scrollY(val: number) { this._el.scrollTop = val }
    get scrollX() { return this._el.scrollLeft }
    set scrollX(val: number) { this._el.scrollLeft = val }
    get rect() { return this._el.getBoundingClientRect() }

    closest(selector: string) {
        const res = this._el.closest(selector)
        return res ? element(res as HTMLElement) : false
    }
    selectOne(selector: string) { return this._el.querySelector(selector) }
    selectAll(selector: string) { return Array.from(this._el.querySelectorAll(selector)).map(e => element(e as HTMLElement)) }
    appendChild(...children: any[]) {
        children.forEach((c) => {
            if (!c) return
            if (typeof c === "function") { this.appendChild(c(HELPERS)); return }
            if (typeof c === "string") this._el.appendChild(document.createTextNode(c))
            else if (c instanceof Node) this._el.appendChild(c)
            else if ((c as any).resume) this._el.appendChild((c as HTMLElementBuilder).resume())
            else this._el.appendChild((element(c as JSONElement) as HTMLElementBuilder).resume())
        })
        return this
    }
    prepend(...children: any[]) {
        [...children].reverse().forEach((c) => {
            if (!c) return
            if (typeof c === "function") { this.prepend(c(HELPERS)); return }
            if (typeof c === "string") this._el.prepend(document.createTextNode(c))
            else if (c instanceof Node) this._el.prepend(c)
            else if ((c as any).resume) this._el.prepend((c as HTMLElementBuilder).resume())
            else this._el.prepend((element(c as JSONElement) as HTMLElementBuilder).resume())
        })
        return this
    }
    fromJSON(json: JSONElement) {
        const { children, ...props } = json
        Object.entries(props).forEach(([key, value]) => {
            if (key === "class") this.addClass(value as any)
            else if (key === "style") this.style(value as any)
            else if (key === "assign" || key === "attrs") this.assign(value as any)
            else if (key === "content") typeof value === "string" ? this.content(value) : this.appendChild(value as any)
            else if (key === "id") this.id(value as string)
            else if (typeof (this as any)[key] === "function") (this as any)[key](value)
        })
        children && this.appendChild(...(Array.isArray(children) ? children.flat() : [children]))
        return this
    }
    assign(props: any) { Object.assign(this._el, props); return this }
    id(value?: string) {
        if (value === undefined) return this._el.id
        this._el.id = value
        return this
    }
    attr(nameOrAttrs: string | Record<string, string>, value?: string) {
        if (typeof nameOrAttrs === "string") {
            if (value === undefined) return this._el.getAttribute(nameOrAttrs)
            this._el.setAttribute(nameOrAttrs, value)
            return this
        }
        Object.entries(nameOrAttrs).forEach(([key, val]) => this._el.setAttribute(key, val))
        return this
    }
    style(props: any) {
        props = buildStyle(props)
        Object.assign(this._el.style, props)
        return this
    }
    dataset(props: any, value?: any) {
        if (typeof props === "string" && value !== undefined) this._el.dataset[props] = String(value)
        else Object.assign(this._el.dataset, props)
        return this
    }
    getDataset(key: string) { return this._el.dataset[key] }
    private manipularClases(cls: string | string[], accion: "add" | "remove" | "toggle") {
        (Array.isArray(cls) ? cls : [cls]).forEach((c) => c && c.split(" ").forEach((token) => token && this._el.classList[accion](token)))
        return this
    }
    addClass(cls: string | string[]) { return this.manipularClases(cls, "add") }
    removeClass(cls: string | string[]) { return this.manipularClases(cls, "remove") }
    toggleClass(cls: string | string[]) { return this.manipularClases(cls, "toggle") }
    content(html: string) { this._el.innerHTML = html; return this }
    onclick(fn: any) { this._el.onclick = fn; return this }
    on({ event, handler, options }: any) { this._el.addEventListener(event, handler, options); return this }
    ready(fn: () => void) {
        if (this._el === document.documentElement || this._el === document.body || (this._el as any) === document) document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn()
        return this
    }
    resize!: (handler: (ev: UIEvent) => any) => HTMLElementBuilder
    keydown!: (handler: (ev: KeyboardEvent) => any) => HTMLElementBuilder
    keyup!: (handler: (ev: KeyboardEvent) => any) => HTMLElementBuilder
    mousedown!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mouseup!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mousemove!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    drag!: (handler: (ev: DragEvent) => any) => HTMLElementBuilder
    mouseout!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mouseenter!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    click!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    dblclick!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    contextmenu!: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    touchstart!: (handler: (ev: TouchEvent) => any) => HTMLElementBuilder
    touchend!: (handler: (ev: TouchEvent) => any) => HTMLElementBuilder
}

export function element(target: ElementTarget[], param: false): (HTMLElementBuilder | false)[]
export function element(target: ElementTarget[], param?: string | true): HTMLElementBuilder[]
export function element(target: ElementTarget, param: false): HTMLElementBuilder | false
export function element(target: ElementTarget, param?: string | true): HTMLElementBuilder
export function element(target: ElementTarget | ElementTarget[], param?: string | boolean): HTMLElementBuilder | false | (HTMLElementBuilder | false)[] {
    if (Array.isArray(target)) return target.map(t => element(t, param as any)) as any
    if ((target as any) instanceof ElementBuilderImpl || (target as any).resume) return target as HTMLElementBuilder
    let el: HTMLElement | null = null, props: JSONElement | null = null
    if (typeof target === "function") return element(target(HELPERS))
    if (typeof target === "string") {
        if (typeof param === "boolean") {
            if (param === true) {
                el = document.querySelector(target)
                if (!el) el = parseEmmetString(target)
            } else {
                el = document.querySelector(target)
                if (!el) return false;
            }
        } else if (typeof param === "string") {
            const fullSelector = target + param
            if (REGEX_INVALID_SELECTOR.test(param) || REGEX_INVALID_SELECTOR.test(fullSelector)) console.error(`Selector inválido "${fullSelector}".`)
            else {
                el = document.querySelector(fullSelector)
                if (!el) el = parseEmmetString(fullSelector)
            }
        }
        if (!el) el = parseEmmetString(target)
    }
    else if (target instanceof Element || target instanceof Window || target instanceof Document) el = target as HTMLElement
    else { const key = Object.keys(target)[0]; el = parseEmmetString(key); props = target[key] }
    if (!el) throw new Error("No se pudo resolver el elemento")
    const builder = new ElementBuilderImpl(el)
    if (props) builder.fromJSON(props)
    return builder
}

export const StyleSingleton = {
    styles: {} as Record<string, any>,
    add(id: string, css: any) {
        css = buildStyle(css)
        this.styles[id] = css
        this.update()
    },
    update() {
        const deepMerge = (t: any, s: any): any => {
            const o = (v: any) => v && typeof v === 'object' && !Array.isArray(v)
            if (!o(t) || !o(s)) return s
            const res = { ...t }
            Object.keys(s).forEach(k => { res[k] = o(t[k]) && o(s[k]) ? deepMerge(t[k], s[k]) : s[k] })
            return res
        }
        insertStyle({ id: "fluid-ui-singleton", css: toCSS(Object.values(this.styles).reduce((acc, val) => deepMerge(acc, val), {})) })
    }
}

const updateVars = () => StyleSingleton.add("variables", ($: typeof CSS_HELPERS) => ({ ":root": { vars: { windowWidth: $.px(window.innerWidth), windowHeight: $.px(window.innerHeight) } } }))

if (typeof window !== "undefined") {
    window.addEventListener("resize", updateVars)
    document.addEventListener("DOMContentLoaded", updateVars)
    updateVars()
}
