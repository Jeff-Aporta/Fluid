import type { TStrNum } from "@components/ui/ts/constantes"
import type { range, rangeMapEntries, transition, animation, transform, boxShadow, convertBoxShadow, border, rgb, rgba, important, lerpcss, clampwcss, clamphcss, hsl, lightDark, calc, url, format, hslFrom, rgbFrom, cssVar, em, rem, px, percent, s, ms, deg, vh, vw, join, joinSpace, joinComma, linearGradient, radialGradient, background, font, margin, padding, cubicBezier, filter, dropShadow, blur, brightness, contrast, hueRotate, invert, opacity, saturate, sepia, text, ltw, gtw, btww, lth, gth, btwh, add, sub, mult, div, group, max, min, addagr, subagr, multagr, divagr } from "./helpers"
import type { lerp, clamp, porcentajeEnRango, mapear, random, randomElemento, randomEntero, enRango, distancia } from "@components/ui/utilidades/ts/matematicas"
// --- Types ---
export type TVars = Record<string, TStrNum | TStrNum[] | undefined>
export type TValorMapaCSS = TStrNum | boolean | null | undefined | TMapaCSS | TMapaCSS[] | ((helpers: THelpers) => string | number | boolean | TMapaCSS) | TVars | string[]
export type THelpers = {
    none: string; hidden: string; visible: string; absolute: string; relative: string
    block: string; inline: string; inlineBlock: string; flex: string; grid: string
    column: string; row: string; flexEnd: string; spaceBetween: string; spaceAround: string; spaceEvenly: string; wrap: string
    auto: string; inherit: string; initial: string; unset: string; transparent: string
    currentColor: string; pointer: string; squareRatio: string
    normal: string; left: string; center: string; uppercase: string; nowrap: string; dark: string; light: string; thin: string
    notAllowed: string; borderBox: string; antialiased: string; touch: string; middle: string
    fixed: string; sticky: string; static: string; flexStart: string;
    top: string; right: string; bottom: string;
    topRight: string; topLeft: string; bottomRight: string; bottomLeft: string
    range: typeof range; rangeMapEntries: typeof rangeMapEntries; transition: typeof transition; animation: typeof animation; transform: typeof transform; boxShadow: typeof boxShadow; convertBoxShadow: typeof convertBoxShadow; border: typeof border
    rgb: typeof rgb; rgba: typeof rgba; important: typeof important; cubicBezier: typeof cubicBezier
    lerpcss: typeof lerpcss; clampwcss: typeof clampwcss; clamphcss: typeof clamphcss; hsl: typeof hsl; lightDark: typeof lightDark; calc: typeof calc; url: typeof url; format: typeof format
    hslFrom: typeof hslFrom; rgbFrom: typeof rgbFrom; cssVar: typeof cssVar; add: typeof add; sub: typeof sub; mult: typeof mult; div: typeof div; group: typeof group; max: typeof max; min: typeof min
    addagr: typeof addagr; subagr: typeof subagr; multagr: typeof multagr; divagr: typeof divagr
    em: typeof em; rem: typeof rem; px: typeof px; percent: typeof percent; s: typeof s; ms: typeof ms; deg: typeof deg; vh: typeof vh; vw: typeof vw
    join: typeof join; joinSpace: typeof joinSpace; joinComma: typeof joinComma; linearGradient: typeof linearGradient; radialGradient: typeof radialGradient; background: typeof background; font: typeof font; fontFamily: typeof font; margin: typeof margin; padding: typeof padding
    filter: typeof filter; dropShadow: typeof dropShadow; blur: typeof blur; brightness: typeof brightness; contrast: typeof contrast; hueRotate: typeof hueRotate; invert: typeof invert; opacity: typeof opacity; saturate: typeof saturate; sepia: typeof sepia; grayscale: typeof import("./helpers").grayscale
    text: typeof text;
    ltw: typeof ltw; gtw: typeof gtw; btww: typeof btww; lth: typeof lth; gth: typeof gth; btwh: typeof btwh
    lerp: typeof lerpcss // alias para mejor legibilidad
    clampw: typeof clampwcss; clamph: typeof clamphcss; lerpw: typeof lerpcss; lerph: typeof import("./helpers").lerphcss
    math: {
        lerp: typeof lerp; clamp: typeof clamp; porcentajeEnRango: typeof porcentajeEnRango; mapear: typeof mapear;
        random: typeof random; randomElemento: typeof randomElemento; randomEntero: typeof randomEntero; enRango: typeof enRango; distancia: typeof distancia
    }
}
// --- Interfaces ---
export interface TMapaCSS { [selector: string]: TValorMapaCSS; vars?: Record<string, TStrNum | TStrNum[] | undefined> }
export interface ToCSSOptions extends TMapaCSS { inferir?: boolean; asString?: boolean; decimalesInferencia?: number; clasesKebab?: boolean; profundidad?: number; initheader?: string | string[]; pretty?: boolean }
export interface Expr { resolve(ctxUnit?: string): string; preferredUnit?: string }
export interface InsertStyleOptions { style?: HTMLStyleElement; id?: string; clases?: string | string[]; css?: string | ToCSSOptions | ((helpers: THelpers) => ToCSSOptions);[key: string]: any }
export type InsertStyleInput = InsertStyleOptions | string
