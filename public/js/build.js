import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
/** 1. Variables del modulo */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** 2. Plugins y Configuracion */
/** Plugin para ignorar archivos svelte y css durante el build */
const stubPlugin = {
    name: 'stub',
    /** @param {import('esbuild').PluginBuild} build */
    setup(build) {
        /** Resolver svelte a namespace virtual */
        build.onResolve({ filter: /\.svelte$/ }, args => ({ path: args.path, namespace: 'stub-svelte' }));
        /** Cargar modulo svelte como objeto vacio */
        build.onLoad({ filter: /.*/, namespace: 'stub-svelte' }, args => ({ contents: 'export default {}', loader: 'js' }));
        /** Resolver css a namespace virtual */
        build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'stub-css' }));
        /** Cargar css como contenido vacio */
        build.onLoad({ filter: /.*/, namespace: 'stub-css' }, args => ({ contents: '', loader: 'css' }));
    }
};
/** 3. Inicializacion del Modulo */
const moduloInicio = async () => {
    try {
        await esbuild.build({
            entryPoints: [path.resolve(__dirname, '../../index.ts')],
            bundle: true,
            outfile: path.resolve(__dirname, 'fluid.js'),
            format: 'iife',
            globalName: 'FluidUI',
            plugins: [stubPlugin],
            logLevel: 'info',
            minify: true,
            banner: { js: '// @ts-nocheck' }
        });
    } catch (e) {
        process.exit(1);
    }
};
moduloInicio();
