import { toCSS } from "../CSS/toCSS"
import { insertStyle } from "../CSS/insertStyle"
import { HELPERS as CSS_HELPERS } from "../CSS/helpers"
import type { ElementTarget, JSONElement, HTMLElementBuilder } from "./types"
export * from "./types"

// --- Variables del Módulo ---
const HELPERS = { br: { br: {} }, hr: { hr: {} } }
const REGEX_TEXT_CONTENT = /\{([^\}]+)\}/
const REGEX_ATTR_BLOCK = /\[([^\]]+)\]/g
const REGEX_ATTR_PAIR = /([a-zA-Z0-9-_]+)(?:=(?:"([^"]*)"|'([^']*)'|([^ ]*)))?/g
const REGEX_TAG = /^([a-zA-Z0-9-]+)/
const REGEX_ID = /#([a-zA-Z0-9-_]+)/
const REGEX_CLASS = /\.([a-zA-Z0-9-_]+)/g

// --- Arrow Functions ---
const parseEmmetString = (str: string): HTMLElement => {
    let content = ''
    str = str.replace(REGEX_TEXT_CONTENT, (_, c) => (content = c, '')) // Extrae contenido

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

// --- Funciones Estándar y Clases ---
export function element(target: ElementTarget, querySelector?: string): HTMLElementBuilder {
    let el: HTMLElement | null = null, props: JSONElement | null = null

    if (typeof target === "function") return element(target(HELPERS))

    if (typeof target === "string") {
        if (querySelector) {
            if (/[\s>+~]/.test(querySelector)) console.error(`Selector inválido "${querySelector}". Prohibidos selectores hijos/hermanos.`)

            const fullSelector = target + querySelector
            if (/[\s>+~]/.test(fullSelector)) console.error(`Combinación inválida "${fullSelector}".`)
            else {
                el = document.querySelector(fullSelector)
                if (!el) el = parseEmmetString(fullSelector)
            }
        }
        if (!el) el = parseEmmetString(target)
    }
    else if (target instanceof HTMLElement || target instanceof Window || target instanceof Document) el = target as HTMLElement
    else { const key = Object.keys(target)[0]; el = parseEmmetString(key); props = target[key] }

    if (!el) throw new Error("No se pudo resolver el elemento")

    // Glosario: e=evento, h=handler, o=opciones
    const addEvent = ({ e, h, o }: { e: string; h: any; o?: any }) => (el!.addEventListener(e, h, o), builder)
    const genEvent = ({ events }: { events: string[] }) => events.reduce((a, v) => ({ ...a, [v]: (handler: any) => addEvent({ e: v, h: handler }) }), {})
    const manipularClases = (cls: string | string[], accion: "add" | "remove" | "toggle") => ((Array.isArray(cls) ? cls : [cls]).forEach((c) => c && c.split(" ").forEach((token) => token && el!.classList[accion](token))), builder)

    const builder: HTMLElementBuilder = {
        resume: () => el!,
        html: () => el!.outerHTML,
        innerHTML: () => el!.innerHTML,
        text: () => el!.innerText,
        selectOne: (selector) => el!.querySelector(selector),
        selectAll: (selector) => el!.querySelectorAll(selector),
        ready: (fn) => {
            if (el === document.documentElement || el === document.body || (el as any) === document) document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn()
            return builder
        },
        appendChild(...children) {
            children.forEach((c) => {
                if (!c) return
                if (typeof c === "function") { builder.appendChild(c(HELPERS)); return }
                if (typeof c === "string") el!.appendChild(document.createTextNode(c))
                else if (c instanceof Node) el!.appendChild(c)
                else if ((c as any).resume) el!.appendChild((c as HTMLElementBuilder).resume())
                else el!.appendChild(element(c as JSONElement).resume())
            })
            return builder
        },
        fromJSON(json) {
            const { children, ...props } = json
            Object.entries(props).forEach(([key, value]) => {
                if (key === "class") builder.addClass(value as any)
                else if (key === "style") builder.style(value as any)
                else if (key === "assign" || key === "attrs") builder.assign(value as any)
                else if (key === "content") typeof value === "string" ? builder.content(value) : builder.appendChild(value as any)
                else if (key === "id") builder.id(value as string)
                else if (typeof (builder as any)[key] === "function") (builder as any)[key](value)
            })
            children && builder.appendChild(...(Array.isArray(children) ? children.flat() : [children]))
            return builder
        },
        assign: (props) => (Object.assign(el!, props), builder),
        id: (value) => ((el!.id = value), builder),
        style: (props) => {
            if (typeof props === 'function') props = props(CSS_HELPERS)
            Object.assign(el!.style, props)
            return builder
        },
        addClass: (cls) => manipularClases(cls, "add"),
        removeClass: (cls) => manipularClases(cls, "remove"),
        toggleClass: (cls) => manipularClases(cls, "toggle"),
        content: (html) => ((el!.innerHTML = html), builder),
        onclick: (fn) => ((el!.onclick = fn as any), builder),
        on: ({ event, handler, options }) => addEvent({ e: event, h: handler, o: options }),
        ...genEvent({ events: ["resize", "keydown", "keyup", "mousedown", "mouseup", "mousemove", "drag", "mouseout", "mouseenter", "click", "dblclick", "contextmenu", "touchstart", "touchend"] }),
    } as HTMLElementBuilder

    if (props) builder.fromJSON(props)
    return builder
}

export const StyleSingleton = {
    styles: {} as Record<string, any>,
    add(id: string, css: any) {
        if (typeof css === 'function') css = css(CSS_HELPERS)
        this.styles[id] = css
        this.update()
    },
    update() { insertStyle({ id: "fluid-ui", css: toCSS(Object.values(this.styles).reduce((acc, val) => ({ ...acc, ...val }), {})) }) }
}
