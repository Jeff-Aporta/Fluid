/**
 cd "C:\Users\JAGUDELOE\Documents\Contapyme\ContaPymeU\ISW-ContaPymeU"
 npx -y tsx src/components/ui/utilidades/fluid/src/CSS/test/traductor.test.ts 
*/
import { traductor, translateToCSS } from "../traductor";
import { runToCSSTests } from "./toCSS.test";
import * as fs from "fs";
import * as path from "path";

// ==========================================
// Variables del Módulo
// ==========================================
const DIRECTORIO_PRUEBAS = path.resolve("src/components/ui/utilidades/fluid/src/CSS/test/files");

// ==========================================
// Funciones Flecha
// ==========================================
const normalizador = ({ str }: { str: string }) => str.replace(/\s+/g, "")

const visualizadorDiferencia = ({ obtenida, esperada }: { obtenida: string, esperada: string }) => {
    let j = 0;
    while (j < obtenida.length && j < esperada.length && obtenida[j] === esperada[j]) j++;

    console.log(`\nDiferencia en índice ${j}: `);
    console.log(`Obtenida: ...${obtenida.slice(Math.max(0, j - 20), j + 20)}...`);
    console.log(`Esperada: ...${esperada.slice(Math.max(0, j - 20), j + 20)}...`);

    if (obtenida.length !== esperada.length) console.log(`\nLongitud diferente: Obtenida(${obtenida.length}) vs Esperada(${esperada.length})`);
}

const procesadorCaso = ({ archivoCss, index }: { archivoCss: string, index: number }) => {
    const nombreBase = archivoCss.replace(".css", "");
    const rutaJs = path.join(DIRECTORIO_PRUEBAS, `${nombreBase}.js`);

    if (!fs.existsSync(rutaJs)) return console.warn(`⚠️ No se encontró archivo JS para ${archivoCss}`), true;

    console.log(`\n🔹 Ejecutando caso de prueba ${index + 1}: ${nombreBase}...`);

    const contenidoCss = fs.readFileSync(path.join(DIRECTORIO_PRUEBAS, archivoCss), "utf-8");
    const contenidoJs = fs.readFileSync(rutaJs, "utf-8").replace("// @ts-nocheck", "").trim();

    try {
        const salida = traductor(contenidoCss);
        const [salidaNorm, esperadaNorm] = [normalizador({ str: salida }), normalizador({ str: contenidoJs })];

        if (salidaNorm === esperadaNorm) {
            console.log(`✅ CASO ${nombreBase} (CSS -> JS) EXITOSO`);

            // Prueba Inversa: JS -> CSS
            try {
                const cssReconstruido = translateToCSS(salida);
                console.log(`\n[DEBUG] CSS Reconstruido para ${nombreBase}:\n${cssReconstruido}\n`);
                const cssReconstruidoNorm = normalizador({ str: cssReconstruido });
                const contenidoCssNorm = normalizador({ str: contenidoCss });

                if (cssReconstruidoNorm === contenidoCssNorm) {
                    console.log(`✅ CASO ${nombreBase} (JS -> CSS) EXITOSO: Reversible correctamente.`);
                } else {
                    console.warn(`⚠️ CASO ${nombreBase} (JS -> CSS) DIFERENCIAS DE FORMATO (Esperado):`);
                }

                // Prueba de Ciclo: CSS -> JS -> CSS -> JS (4 iteraciones)
                let currentCSS = cssReconstruido;
                let previousJS = salidaNorm;
                let stable = true;

                for (let i = 1; i <= 4; i++) {
                    const currentJS = traductor(currentCSS);
                    const currentJSNorm = normalizador({ str: currentJS });

                    if (currentJSNorm !== previousJS) {
                        console.error(`❌ CASO ${nombreBase} (ITERACIÓN ${i}) FALLIDO: Inestable.`);
                        visualizadorDiferencia({ obtenida: currentJSNorm, esperada: previousJS });
                        stable = false;
                        break;
                    }

                    console.log(`✅ CASO ${nombreBase} (ITERACIÓN ${i}) EXITOSO: Estable.`);

                    // Preparar siguiente iteración
                    if (i < 4) {
                        currentCSS = translateToCSS(currentJS);
                        previousJS = currentJSNorm;
                    }
                }

                if (!stable) return false;

            } catch (e) {
                console.error(`❌ CASO ${nombreBase} (JS -> CSS) FALLÓ CON ERROR:`, e);
                return false;
            }

            return true;
        }

        console.error(`❌ CASO ${nombreBase} FALLIDO: La salida no coincide.`);
        visualizadorDiferencia({ obtenida: salidaNorm, esperada: esperadaNorm });
        return false;
    } catch (error) {
        console.error(`❌ ERROR EN CASO ${nombreBase}: `, error);
        return false;
    }
}

// ==========================================
// Función de Inicio
// ==========================================
const moduloInicio = () => {
    console.log("🚀 Iniciando suite de pruebas completa...");

    // Ejecutar pruebas de toCSS
    if (!runToCSSTests()) {
        console.error("💥 PRUEBAS DE toCSS FALLARON. Abortando pruebas de traductor.");
        process.exit(1);
    }
    console.log("\n--------------------------------------------------\n");

    console.log("🧪 Iniciando prueba de traductor con archivos externos...");

    if (!fs.existsSync(DIRECTORIO_PRUEBAS)) return console.error(`❌ No se encontró el directorio de pruebas: ${DIRECTORIO_PRUEBAS}`);

    const archivosCss = fs.readdirSync(DIRECTORIO_PRUEBAS).filter(f => f.endsWith(".css")).sort();
    if (archivosCss.length === 0) return console.warn("⚠️ No se encontraron archivos .css para probar.");

    let todosPasaron = true;
    archivosCss.forEach((archivoCss, index) => !procesadorCaso({ archivoCss, index }) && (todosPasaron = false));

    if (todosPasaron) console.log("\n✨ TODOS LOS CASOS PASARON EXITOSAMENTE ✨");
    else console.error("\n💥 ALGUNOS CASOS FALLARON 💥"), process.exit(1);
}

// ==========================================
// Ejecución
// ==========================================
moduloInicio();
