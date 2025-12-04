// 1. Types
export type ElementTarget = string | HTMLElement | Window | Document | JSONElement | ((helpers: any) => JSONElement)

// 2. Interfaces
export interface JSONElement { [key: string]: any }
export interface HTMLElementBuilder {
    resume: () => HTMLElement
    html: () => string
    innerHTML: () => string
    text: () => string
    selectOne: (selector: string) => Element | null
    selectAll: (selector: string) => NodeListOf<Element>
    appendChild: (...children: (string | Node | HTMLElementBuilder | JSONElement | ((helpers: any) => any))[]) => HTMLElementBuilder
    fromJSON: (json: JSONElement) => HTMLElementBuilder
    assign: (props: Record<string, any>) => HTMLElementBuilder
    id: (value: string) => HTMLElementBuilder
    style: (props: Partial<CSSStyleDeclaration> | ((helpers: any) => Partial<CSSStyleDeclaration>)) => HTMLElementBuilder
    addClass: (cls: string | string[]) => HTMLElementBuilder
    removeClass: (cls: string | string[]) => HTMLElementBuilder
    toggleClass: (cls: string | string[]) => HTMLElementBuilder
    content: (html: string) => HTMLElementBuilder
    onclick: (fn: (ev: MouseEvent) => any) => HTMLElementBuilder
    on: ({ event, handler, options }: { event: string; handler: EventListenerOrEventListenerObject; options?: boolean | AddEventListenerOptions }) => HTMLElementBuilder
    resize: (handler: (ev: UIEvent) => any) => HTMLElementBuilder
    keydown: (handler: (ev: KeyboardEvent) => any) => HTMLElementBuilder
    keyup: (handler: (ev: KeyboardEvent) => any) => HTMLElementBuilder
    mousedown: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mouseup: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mousemove: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    drag: (handler: (ev: DragEvent) => any) => HTMLElementBuilder
    mouseout: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    mouseenter: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    click: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    dblclick: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    contextmenu: (handler: (ev: MouseEvent) => any) => HTMLElementBuilder
    touchstart: (handler: (ev: TouchEvent) => any) => HTMLElementBuilder
    touchend: (handler: (ev: TouchEvent) => any) => HTMLElementBuilder
    ready: (fn: () => void) => HTMLElementBuilder
}