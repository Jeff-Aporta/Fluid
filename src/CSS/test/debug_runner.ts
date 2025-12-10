import { traductor, translateToCSS } from "../traductor";
import * as fs from "fs";
import * as path from "path";

const DIRECTORIO_PRUEBAS = path.resolve("src/components/ui/utilidades/fluid/src/CSS/test/files");

const normalizador = ({ str }: { str: string }) => str.replace(/\s+/g, "")

const visualizadorDiferencia = ({ obtenida, esperada }: { obtenida: string, esperada: string }) => {
    let j = 0;
    while (j < obtenida.length && j < esperada.length && obtenida[j] === esperada[j]) j++;

    const diffMsg = `Diferencia en índice ${j}:
Obtenida: ...${obtenida.slice(Math.max(0, j - 50), j + 50)}...
Esperada: ...${esperada.slice(Math.max(0, j - 50), j + 50)}...
Length: ${obtenida.length} vs ${esperada.length}
`;
    fs.writeFileSync("debug_diff.txt", diffMsg);

    console.log(`\nDiferencia en índice ${j}: `);
    console.log(`Obtenida: ...${obtenida.slice(Math.max(0, j - 20), j + 20)}...`);
    console.log(`Esperada: ...${esperada.slice(Math.max(0, j - 20), j + 20)}...`);

    if (obtenida.length !== esperada.length) console.log(`\nLongitud diferente: Obtenida(${obtenida.length}) vs Esperada(${esperada.length})`);
}

const procesadorCaso = ({ archivoCss }: { archivoCss: string }) => {
    const nombreBase = archivoCss.replace(".css", "");
    const rutaJs = path.join(DIRECTORIO_PRUEBAS, `${nombreBase}.js`);

    console.log(`\n🔹 Ejecutando caso de prueba: ${nombreBase}...`);

    const contenidoCss = fs.readFileSync(path.join(DIRECTORIO_PRUEBAS, archivoCss), "utf-8");
    const contenidoJs = fs.readFileSync(rutaJs, "utf-8").replace("// @ts-nocheck", "").trim();

    try {
        const salida = traductor(contenidoCss);
        const [salidaNorm, esperadaNorm] = [normalizador({ str: salida }), normalizador({ str: contenidoJs })];

        if (salidaNorm === esperadaNorm) {
            console.log(`✅ CASO ${nombreBase} (CSS -> JS) EXITOSO`);

            const cssReconstruido = translateToCSS(salida);
            console.log(`\n[DEBUG] CSS Reconstruido:\n${cssReconstruido}\n`);

            // Prueba de Ciclo: CSS -> JS -> CSS -> JS (4 iteraciones)
            let currentCSS = cssReconstruido;
            let previousJS = salidaNorm;
            let stable = true;

            for (let i = 1; i <= 4; i++) {
                const currentJS = traductor(currentCSS);
                const currentJSNorm = normalizador({ str: currentJS });

                if (currentJSNorm !== previousJS) {
                    console.error(`❌ CASO ${nombreBase} (ITERACIÓN ${i}) FALLIDO: Inestable.`);
                    fs.writeFileSync("debug_unstable_obtenida.txt", currentJSNorm);
                    fs.writeFileSync("debug_unstable_esperada.txt", previousJS);
                    visualizadorDiferencia({ obtenida: currentJSNorm, esperada: previousJS });
                    stable = false;
                    break;
                }

                console.log(`✅ CASO ${nombreBase} (ITERACIÓN ${i}) EXITOSO: Estable.`);

                if (i < 4) {
                    currentCSS = translateToCSS(currentJS);
                    previousJS = currentJSNorm;
                }
            }

            if (!stable) return false;

            return true;
        }

        console.error(`❌ CASO ${nombreBase} FALLIDO: La salida no coincide.`);
        fs.writeFileSync("debug_obtenida.txt", salidaNorm);
        fs.writeFileSync("debug_esperada.txt", esperadaNorm);
        visualizadorDiferencia({ obtenida: salidaNorm, esperada: esperadaNorm });
        return false;
    } catch (error) {
        console.error(`❌ ERROR EN CASO ${nombreBase}: `, error);
        return false;
    }
}

procesadorCaso({ archivoCss: "test.css" });
