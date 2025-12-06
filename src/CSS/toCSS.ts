/** 1. Imports */
import type { TStrNum } from "@components/ui/ts/constantes"
import type { ToCSSOptions, TMapaCSS, THelpers } from "./types"
import { HELPERS, CSS_ATTRS_NUMBER, HTML_TAGS } from "./helpers"

/** 5. Arrow Functions */
export const buildStyle = (style: any) => typeof style === 'function' ? style(HELPERS) : style

/** 6. Funciones Estándar y Clases */
/** Formatea JSON a CSS */
export function fmtJSON(json: string, pretty: boolean = false): string {
  let res = json.replaceAll('\\"', "$comillas$").replaceAll('"', "").replace(/\}\s*,/g, "}")
  if (pretty) res = res.replace(/,\n/g, ";\n").replace(/([^;{}])\n\s*\}/g, "$1;\n}")
  else res = res.replace(/,\n/g, ";").replace(/([^;{}])\n\s*\}/g, "$1;}")
  res = res.replace(/:?\s*"?\{\s*/g, pretty ? "{\n" : "{").replace(/\\[nr]/g, " ").replaceAll("$comillas$", '"').replace(/(@import[^:]*):\s*/g, "$1 ")
  if (!pretty) res = res.replace(/\s+/g, " ")
  else res = res.replace(/:\s*/g, ": ")
  return res
}

/** Convierte objeto a CSS */
export function toCSS(options: ToCSSOptions | ((helpers: THelpers) => ToCSSOptions)): string {
  const resolvedOptions = buildStyle(options)
  const { inferir = true, decimalesInferencia = 3, clasesKebab = true, profundidad = 0, vars, initheader, pretty = false, ...mapaCss } = resolvedOptions
  const mapa: Record<string, TStrNum | boolean> = {}

  if (vars) Object.entries(vars).forEach(([k, v]) => v !== undefined && (mapa[`--${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`] = Array.isArray(v) ? (v.length > 1 ? `var(${v[0]}, ${v[1]})` : String(v[0])) : String(v)))

  Object.entries(mapaCss).forEach(([selOrig, val]) => {
    let sel: string = selOrig
    if (val === undefined || val === null) return
    val = buildStyle(val)
    if (typeof val === "string" && val.trim() === "") return

    const esHTML = HTML_TAGS.includes(sel), esObj = typeof val === "object" && val !== null && !Array.isArray(val)
    const esClase = sel.startsWith("."), esId = sel.startsWith("#"), esDec = sel.startsWith("@"), esVar = sel.startsWith("--")

    if (!esClase && !esId && !esDec && !sel.includes(",") && !esHTML) {
      let kebab = !esObj ? sel.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`) : sel
      if (kebab.startsWith("webkit-") || kebab.startsWith("moz-")) kebab = `-${kebab}`
      clasesKebab && sel !== kebab && (sel = esObj ? `.${kebab}` : kebab)
    }

    if (esObj) {
      mapa[sel] = fmtJSON(toCSS({ profundidad: profundidad + 1, inferir, decimalesInferencia, clasesKebab, pretty, ...val as TMapaCSS }), pretty)
      return
    }

    const esNum = typeof val === "number", noInferir = !CSS_ATTRS_NUMBER.includes(sel) && !esVar
    if (inferir && esNum && noInferir) { mapa[sel] = `${parseFloat((val as number).toFixed(decimalesInferencia))}px`; return }
    mapa[sel] = val as TStrNum | boolean
  })

  for (const k in mapa) (mapa[k] === undefined || mapa[k] === null || mapa[k] === "") ? delete mapa[k] : typeof mapa[k] === "string" && (mapa[k] = (mapa[k] as string).replace(/\s+/g, " ").trim())

  let css = fmtJSON(JSON.stringify(mapa, null, pretty ? 4 : 1), pretty)
  if (profundidad === 0) {
    css = css.trim()
    if (css.startsWith("{") && css.endsWith("}")) css = css.substring(1, css.length - 1).trim()
  }

  if (profundidad === 0 && initheader) {
    const headerStr = Array.isArray(initheader) ? initheader.join("\n") : initheader
    return `${headerStr}\n${css}`
  }

  return css
}
