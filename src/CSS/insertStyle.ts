// 1. Imports
import { toCSS } from "./toCSS"
import { HELPERS } from "./helpers"
import type { InsertStyleInput } from "./types"

// 3. Funciones
export function insertStyle(opt: InsertStyleInput): HTMLStyleElement {
  if (typeof opt === "string") return insertStyle({ css: opt })

  // Glosario: cls=clases, seg=segmentos
  let { style, id, clases = [], css, ...rest } = opt

  if (typeof css === 'function') css = (css as any)(HELPERS)

  const cls: string[] = Array.isArray(clases) ? clases.filter(Boolean) : [clases].filter(Boolean)

  if (!style) {
    if (id) {
      const exist = document.getElementById(id) as HTMLStyleElement
      style = exist || document.createElement("style")
      !exist && (style.id = id)
    } else style = document.createElement("style")
    style.classList.add("fluid", ...cls)
  }

  !document.head.contains(style) && document.head.appendChild(style)

  const seg: string[] = []
  typeof css === "string" && seg.push(css)
  css && typeof css === "object" && seg.push(toCSS(css))
  Object.keys(rest).length > 0 && seg.push(toCSS(rest))

  style.textContent = seg.filter(Boolean).join(" ")
  return style
}
