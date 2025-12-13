/** 1. Imports */
import { toCSS, buildStyle } from "./toCSS"
import type { InsertStyleInput } from "./types"
/** 6. Funciones Estándar y Clases */
/** Inserta o actualiza estilos en el DOM */
export function insertStyle(opt: InsertStyleInput): HTMLStyleElement {
  if (typeof document === "undefined") return {} as any;
  if (typeof opt === "string") return insertStyle({ css: opt })
  let { style, id, clases = [], css, ...rest } = opt
  css = buildStyle(css)
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
