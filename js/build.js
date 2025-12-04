import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin to stub svelte and css files
/** @type {import('esbuild').Plugin} */
const stubPlugin = {
    name: 'stub',
    /** @param {import('esbuild').PluginBuild} build */
    setup(build) {
        // Resolve svelte files to a virtual module
        build.onResolve({ filter: /\.svelte$/ },
            /** @param {import('esbuild').OnResolveArgs} args */
            args => ({ path: args.path, namespace: 'stub-svelte' }));

        // Load the virtual module as a simple JS object (default export)
        build.onLoad({ filter: /.*/, namespace: 'stub-svelte' },
            /** @param {import('esbuild').OnLoadArgs} args */
            args => ({
                contents: 'export default {}',
                loader: 'js',
            }));

        // Resolve css files to a virtual module
        build.onResolve({ filter: /\.css$/ },
            /** @param {import('esbuild').OnResolveArgs} args */
            args => ({ path: args.path, namespace: 'stub-css' }));

        // Load css as empty content
        build.onLoad({ filter: /.*/, namespace: 'stub-css' },
            /** @param {import('esbuild').OnLoadArgs} args */
            args => ({
                contents: '',
                loader: 'css',
            }));
    },
};

Promise.all([
    esbuild.build({
        entryPoints: [path.resolve(__dirname, '../index.ts')],
        bundle: true,
        outfile: path.resolve(__dirname, 'fluid.js'),
        format: 'iife',
        globalName: 'FluidUI',
        plugins: [stubPlugin],
        logLevel: 'info',
        minify: true,
        banner: {
            js: '// @ts-nocheck',
        },
    }),

]).catch(() => process.exit(1));
