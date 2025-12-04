## 4. Módulo de Utilidades (helpers.ts)

Este módulo constituye un repositorio de utilidades auxiliares para la resolución de problemas comunes de CSS mediante funciones puras de TypeScript.

### 4.1. Generadores de Color (Módulo de Color CSS Nivel 5)

La biblioteca adopta el estándar futuro de los colores en la web.

* **Colores Relativos (hslFrom, rgbFrom):** Permiten derivar un nuevo color modificando canales específicos de un color base (incluso si el base es una variable CSS).
  * *Mecánica:* Construye la sintaxis `hsl(from <color-base> <h> <s> <l> / <alpha>)`.
  * *Uso:* Creación de variantes hover, focus o paletas monocromáticas dinámicamente sin conocimiento del color original.

```typescript
// Ejemplo: Creación de un borde semitransparente basado en el color de fondo actual
const borderColor = hslFrom((c, u) => [
    c.var('bg-primary'), // Base
    c.h, c.s, c.l,       // Mantener canales
    0.5                  // Alpha al 50%
]);
```

### 4.2. Tipografía Fluida y Diseño (lerpcss)

Resuelve la problemática de la tipografía responsiva sin saltos abruptos (puntos de interrupción).

* **Fórmula Matemática:** Utiliza la ecuación de la recta (`y = mx + b`) dentro de una función `clamp()` de CSS.
* **Cálculo:**
  1. Se calcula la pendiente (`m`) basada en los puertos de visualización mínimo y máximo (400px - 1100px por defecto).
  2. Se genera una expresión `calc()` que interpola el valor suavemente entre esos dos puntos.
  3. Se envuelve todo en `clamp(min, calc(...), max)` para asegurar límites seguros.

### 4.3. Constructor de Transformaciones

La generación manual de cadenas `transform` complejas es propensa a errores. Este constructor asegura el orden y las unidades.

* **Acumulador de Operaciones:** Cada llamada (`.translate`, `.rotate`) inserta una instrucción en una matriz interna.
* **Serialización:** El método `.str()` une la matriz con espacios, produciendo la cadena final válida para CSS.

## 5. Exemplares de Implementación Avanzada

### 5.1. Componente de Tarjeta Interactiva con Tema Dinámico

El presente ejemplo demuestra la creación de componentes, la gestión de eventos y los estilos anidados.

```typescript
import { element, insertStyle, HELPERS } from './lib';

// 1. Definición de Estilos (CSS-in-JS)
const cardStyles = {
    '.card': {
        border: '1px solid #ddd',
        borderRadius: 8, // Infiere px
        padding: 16,
        boxShadow: HELPERS.boxShadow({ dY: 4, blur: 10, color: 'rgba(0,0,0,0.1)' }),
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: 'white',
        
        // Pseudo-clases anidadas
        '&:hover': {
            transform: HELPERS.transform().translateY(-5).str(),
            boxShadow: HELPERS.boxShadow({ dY: 8, blur: 20, color: 'rgba(0,0,0,0.15)' }),
            cursor: HELPERS.pointer
        }
    },
    '.card-title': {
        fontSize: HELPERS.lerp({ min: 18, max: 24 }), // Tipografía fluida
        color: '#333',
        marginBottom: 8
    }
};

// Inyectar estilos una sola vez
insertStyle({ id: 'card-component-styles', css: cardStyles });

// 2. Definición del Componente (Función Factoría)
interface CardProps {
    title: string;
    description: string;
    onAction: () => void;
}

const Card = ({ title, description, onAction }: CardProps) => {
    return element('article.card')
        // Estructura interna
        .appendChild(
            element('h3.card-title').text(title),
            element('p.card-desc').style({ color: '#666', lineHeight: 1.5 }).text(description),
            element('button.btn-primary{Ver Detalles}')
                .style({ marginTop: 10 })
                .click((e) => {
                    e.stopPropagation(); // Control granular del evento
                    onAction();
                })
        )
        // Evento en el contenedor
        .on({
            event: 'mouseenter',
            handler: () => console.log(`Hover sobre ${title}`),
            options: { passive: true }
        });
};

// 3. Montaje en el DOM
const container = document.getElementById('app');
if (container) {
    element(container).appendChild(
        Card({
            title: "Ingeniería de Software",
            description: "Arquitectura avanzada de sistemas UI.",
            onAction: () => alert("Abriendo detalles...")
        }).resume()
    );
}
```

### 5.2. Utilización de Variables CSS para Tematización

```typescript
import { toCSS, insertStyle } from './lib';

// Definir variables globales
const globalVars = {
    vars: {
        brandColor: '#ff5722',
        spacingUnit: '8px'
    }
};

// Componente que consume las variables
const componentStyles = {
    '.themed-box': {
        // Uso de helper cssVar para referencia segura
        backgroundColor: HELPERS.cssVar('brand-color'),
        padding: HELPERS.calc(c => c.mult(c.var('spacing-unit'), 2)) // calc(var(--spacing-unit) * 2)
    }
};

insertStyle({ id: 'theme-root', css: globalVars });
insertStyle({ id: 'component-theme', css: componentStyles });
```

## 6. Referencia de Definición de Tipos (types.ts)

La solidez de la biblioteca reside en sus definiciones de tipos. La comprensión de las mismas resulta crucial para extender la funcionalidad.

### JSONElement (Estructura de Datos Recursiva)

Define la estructura para crear componentes declarativos puramente mediante datos.

```typescript
interface JSONElement {
    [key: string]: any; 
    // Propiedad especial reservada para anidamiento
    children?: (JSONElement | string)[]; 
}
```

### InsertStyleInput (Configuración Flexible)

Permite sobrecargas para simplificar la API de estilos.

```typescript
type InsertStyleInput = 
    | string // Caso simple: CSS crudo
    | {
        style?: HTMLStyleElement; // Referencia directa para actualizaciones
        id?: string;              // Identificador para gestión de singleton
        clases?: string | string[]; // Clases de metadatos para la etiqueta <style>
        css?: string | object;    // La carga útil real (objeto o cadena)
        [selector: string]: any;  // Firma de índice para reglas CSS adicionales
    }
```

## 7. Léxico de Constantes Internas y Heurística

Ubicadas en `helpers.ts`, las presentes constantes dictaminan el comportamiento del motor de inferencia.

* **CSS_ATTRS_NUMBER (Lista de Exclusión):**
  * Propiedades que, de acuerdo con la especificación CSS, aceptan valores numéricos sin unidad (escalares o contadores).
  * *Incluye:* `z-index`, `scale`, `opacity`, `line-height`, `flex-grow`, `font-weight`.
  * *Comportamiento:* Si una propiedad se encuentra en la presente lista, `toCSS` retorna el número sin modificación. En caso contrario, concatena el sufijo `px`.
* **HTML_TAGS (Validación de Selectores):**
  * Lista exhaustiva de elementos HTML estándar (`div`, `span`, `input`, etc.).
  * *Uso:* `toCSS` emplea dicha lista para distinguir si una clave constituye un selector de etiqueta HTML (v.gr., `button`) o una clase CSS que requiere prefijo (si no comienza con `.`).

## 9. Compendio de Tutoriales de Referencia de la API

A continuación, se presenta un desglose técnico detallado para cada entidad exportada por la biblioteca, diseñado para servir como guía de implementación normativa.

### 9.1. Referencia del Módulo DOM (dom.ts)

#### 9.1.1. element

* **Sinopsis Técnica:** Función factoría primaria para la instanciación de nodos DOM y la inicialización de la interfaz constructora fluida (`HTMLElementBuilder`).
* **Firma:** `element(target: ElementTarget): HTMLElementBuilder`
* **Tutorial de Implementación:**
```typescript
// Caso A: Instanciación mediante Cadena Emmet
const btn = element('button.primary#submit-btn[type="submit"]{Enviar}').resume();

// Caso B: Decoración de Elemento Existente
const existingNode = document.getElementById('app');
if (existingNode) {
    element(existingNode).addClass('initialized');
}

// Caso C: Composición Funcional
const MyComponent = (h) => ({ 
    tag: 'div', 
    class: 'wrapper', 
    children: [h.br, 'Texto'] 
});
element(MyComponent).resume();
```

#### 9.1.2. StyleSingleton

* **Sinopsis Técnica:** Objeto estático para la gestión centralizada de estilos globales o compartidos, implementando un patrón Singleton para evitar la duplicidad de inyecciones en el DOM.
* **Interfaz:** `{ styles: Record<string, any>, add(id, css), update() }`
* **Tutorial de Implementación:**
```typescript
// Registro de un módulo de estilos
StyleSingleton.add('modulo-navegacion', {
    'nav': { display: 'flex', gap: 20 },
    'nav a': { textDecoration: 'none' }
});

// Nota: La invocación de .add() dispara automáticamente .update(),
// regenerando el elemento <style id="fluid-ui"> en el head.
```

### 9.2. Referencia del Módulo Motor CSS (toCSS.ts)

#### 9.2.1. toCSS

* **Sinopsis Técnica:** Motor de compilación que transmuta objetos de configuración de estilos en cadenas CSS sintácticamente válidas.
* **Firma:** `toCSS(options: ToCSSOptions): string`
* **Tutorial de Implementación:**
```typescript
const cssOutput = toCSS({
    inferir: true, // Habilitar inferencia de unidades (px)
    clasesKebab: true, // Convertir camelCase
    vars: { mainColor: 'blue' }, // Definición de variables CSS
    '.container': {
        width: 100, // Inferencia -> 100px
        zIndex: 5,  // Exclusión -> 5
        backgroundColor: 'var(--main-color)'
    }
});
// Resultado: "--main-color: blue; .container { width: 100px; z-index: 5; background-color: var(--main-color); }"
```

#### 9.2.2. fmtJSON

* **Sinopsis Técnica:** Utilidad de bajo nivel para el formateo de cadenas JSON a sintaxis CSS. Generalmente de uso interno, pero expuesta para depuración avanzada.
* **Firma:** `fmtJSON(json: string): string`
* **Tutorial de Implementación:**
```typescript
const rawJson = JSON.stringify({ "color": "red", "margin-top": "10px" });
const cssBody = fmtJSON(rawJson); 
// Transforma: {"key":"val"} -> {key:val;} eliminando comillas y ajustando delimitadores.
```

### 9.3. Referencia del Módulo de Inyección (insertStyle.ts)

#### 9.3.1. insertStyle

* **Sinopsis Técnica:** Mecanismo de inyección de estilos en el documento activo. Gestiona la creación, recuperación y actualización de elementos `<style>`.
* **Firma:** `insertStyle(opt: InsertStyleInput): HTMLStyleElement`
* **Tutorial de Implementación:**
```typescript
// Inyección Básica
insertStyle({ 
    id: 'tema-oscuro', 
    css: { 'body': { backgroundColor: '#333', color: '#fff' } } 
});

// Actualización (Idempotencia)
// Si se invoca nuevamente con el mismo ID, se actualiza el contenido 
// en lugar de crear un nuevo nodo DOM, previniendo fugas de memoria.
```

### 9.4. Referencia del Módulo de Auxiliares (helpers.ts)

#### 9.4.1. HELPERS

* **Sinopsis Técnica:** Objeto contenedor que agrupa todas las utilidades y constantes funcionales. Se inyecta automáticamente en las funciones de estilo.
* **Tutorial de Implementación:**
```typescript
// Uso dentro de una definición de estilos dinámica
const style = (h) => ({
    div: {
        display: h.flex, // Constante "flex"
        boxShadow: h.boxShadow({ dY: 2, blur: 5 }), // Función helper
        color: h.important('red') // Modificador
    }
});
```

#### 9.4.2. Generadores de Color (hsl, rgb, hslFrom, rgbFrom, lightDark)

* **Sinopsis Técnica:** Funciones para la generación de cadenas de color conformes al estándar CSS Color Module 5.
* **Tutorial de Implementación:**
```typescript
// Colores Estándar
const c1 = hsl(200, 50, 50); // "hsl(200, 50%, 50%)"

// Colores Relativos (Sintaxis 'from')
const c2 = hslFrom((c, u) => [
    c.var('color-base'), // Origen
    c.h,                 // Hue inalterado
    c.mult(c.s, 0.8),    // Saturación reducida al 80%
    c.l                  // Luminosidad inalterada
]);

// Esquema Claro/Oscuro
const c3 = lightDark('black', 'white'); // "light-dark(black, white)"
```

#### 9.4.3. Lógica y Matemáticas (calc, cssVar, range)

* **Sinopsis Técnica:** Abstracciones para operaciones lógicas en CSS y generación de secuencias en JS.
* **Tutorial de Implementación:**
```typescript
// Cálculo CSS
const width = calc(c => c.sub('100vw', '20px')); // "calc(100vw - 20px)"

// Variables CSS Seguras
const v = cssVar('spacing-sm', '10px'); // "var(--spacing-sm, 10px)"

// Generación de Rangos (JS util)
const steps = range(0, 100, 10); // [0, 10, 20, ..., 90]
```

#### 9.4.4. Diseño Fluido (lerpcss)

* **Sinopsis Técnica:** Implementación de interpolación lineal para valores responsivos sin puntos de ruptura (breakpoints).
* **Tutorial de Implementación:**
```typescript
const responsiveFont = lerpcss({
    min: 16, // Valor a viewport mínimo (400px default)
    max: 24, // Valor a viewport máximo (1100px default)
    unit: 'px' // Unidad de salida
});
// Retorna una expresión `clamp(...)` compleja.
```

#### 9.4.5. Propiedades Complejas (transform, transition, boxShadow, border)

* **Sinopsis Técnica:** Constructores (Builders) para propiedades CSS que requieren sintaxis compuesta específica.
* **Tutorial de Implementación:**
```typescript
// Transformaciones
const tf = transform()
    .translate(10, 20)
    .rotate(45)
    .scale(1.2)
    .str(); // "translate(10px, 20px) rotate(45deg) scale(1.2)"

// Transiciones Múltiples
const tr = transition({
    opacity: 0.3,
    transform: { time: 0.5, bezier: [0.4, 0, 0.2, 1] }
}); // "opacity 0.3s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
```

#### 9.4.6. Unidades y Modificadores (px, rem, important, url)

* **Sinopsis Técnica:** Funciones auxiliares para el sufijado de unidades y construcción de cadenas de recursos.
* **Tutorial de Implementación:**
```typescript
const val1 = px(15);         // "15px"
const val2 = rem(1.5);       // "1.5rem"
const val3 = important(val1);// "15px !important"
const res  = url('img.png'); // "url(\"img.png\")"
```
