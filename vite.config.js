import { defineConfig } from "vite";
import path from 'path';
import glob from "glob";

process.chdir('./src');

const generateInput = () => {
    const htmlFilePaths = glob.sync(path.resolve(__dirname, "src", "**/*.html"));
    const currentPath = process.cwd();
    return htmlFilePaths.reduce((acc, filePath) => {
        const path = filePath.replace(`${currentPath}/`, '');
        const splitter = path.split('/');
        if (splitter.length === 1) {
            const name = path.replace('.html', '');
            return {
                ...acc,
                [name]: path
            }
        } else if (splitter.length >= 2) {
            const name = path.replace('/index.html', '').split('/').join('-');
            return {
                ...acc,
                [name]: path
            }
        }
        return acc;
    }, {});
};

export default defineConfig({
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: 'override',
        rollupOptions: {
            input: generateInput(),
            output: {
                assetFileNames: ({ name }) => {
                    if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(name ?? '')) {
                        return 'assets/images/[name].[hash][extname]';
                    }
                    if (/\.(s?css)$/.test(name ?? '')) {
                        const splitter = name.split('/');
                        if (splitter.length === 1) {
                            return 'assets/styles/[name].[hash][extname]';
                        } else {
                            splitter.pop();
                            return `assets/styles/${splitter.join('-')}.[hash][extname]`;
                        }

                    }
                    return 'assets/[name].[hash][extname]';
                },
                chunkFileNames: 'assets/scripts/[name].[hash].js',
                entryFileNames: 'assets/scripts/[name].[hash].js',
            }
        }
    }
});