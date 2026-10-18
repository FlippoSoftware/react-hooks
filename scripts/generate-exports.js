#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');
const distDir = join(packageRoot, 'dist');
const packageJsonPath = join(packageRoot, 'package.json');

/**
 * The hooks of dist/hooks.
 */
function getHooks() {
    const hooksDir = join(distDir, 'hooks');

    if (!existsSync(hooksDir)) {
        throw new Error('dist/hooks directory not found. Run build first.');
    }

    return readdirSync(hooksDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();
}

/**
 * The kebab-case name of a hook for the exports.
 */
function toKebabCase(str) {
    return (
        str
            // Split at the capital letters
            .replace(/([A-Z])/g, '-$1')
            // Drop the leading hyphen and lowercase
            .toLowerCase()
            .replace(/^-/, '')
    );
}

/**
 * Whether a file exists.
 */
function checkFileExists(filePath) {
    return existsSync(join(packageRoot, filePath));
}

/**
 * The exports of a hook.
 */
function generateHookExport(hookName) {
    const kebabName = toKebabCase(hookName);
    const basePath = `./dist/hooks/${hookName}`;

    // Which files exist
    const cjsExists = checkFileExists(`${basePath}/index.cjs.js`);
    const esExists = checkFileExists(`${basePath}/index.es.js`);
    const typesExists = checkFileExists(`${basePath}/index.d.ts`);

    if (!cjsExists && !esExists) {
        console.warn(`Warning: No built files found for ${hookName}`);
        return null;
    }

    const exportEntry = {
        types: typesExists ? `${basePath}/index.d.ts` : undefined
    };

    if (esExists && cjsExists) {
        exportEntry.import = `${basePath}/index.es.js`;
        exportEntry.require = `${basePath}/index.cjs.js`;
    } else if (esExists) {
        exportEntry.default = `${basePath}/index.es.js`;
    } else if (cjsExists) {
        exportEntry.default = `${basePath}/index.cjs.js`;
    }

    // Drop the undefined values
    Object.keys(exportEntry).forEach((key) => {
        if (exportEntry[key] === undefined) {
            delete exportEntry[key];
        }
    });

    return {
        key: `./${kebabName}`,
        value: exportEntry
    };
}

/**
 * The main export.
 */
function generateMainExport() {
    const basePath = './dist/hooks';

    const cjsExists = checkFileExists(`${basePath}/index.cjs.js`);
    const esExists = checkFileExists(`${basePath}/index.es.js`);
    const typesExists = checkFileExists(`${basePath}/index.d.ts`);

    const exportEntry = {
        types: typesExists ? `${basePath}/index.d.ts` : undefined
    };

    if (esExists && cjsExists) {
        exportEntry.import = `${basePath}/index.es.js`;
        exportEntry.require = `${basePath}/index.cjs.js`;
    } else if (esExists) {
        exportEntry.default = `${basePath}/index.es.js`;
    } else if (cjsExists) {
        exportEntry.default = `${basePath}/index.cjs.js`;
    }

    // Drop the undefined values
    Object.keys(exportEntry).forEach((key) => {
        if (exportEntry[key] === undefined) {
            delete exportEntry[key];
        }
    });

    return exportEntry;
}

/**
 * Entry point.
 */
function generateExports() {
    console.log('🔄 Generating exports...');

    // Read the current package.json
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // The hooks
    const hooks = getHooks();
    console.log(`📦 Found ${hooks.length} hooks:`, hooks.join(', '));

    // Build the new exports
    const newExports = {};

    // The main export
    console.log('📝 Generating main export...');
    newExports['.'] = generateMainExport();

    // One export per hook
    console.log('📝 Generating component exports...');
    for (const hook of hooks) {
        const exportData = generateHookExport(hook);
        if (exportData) {
            newExports[exportData.key] = exportData.value;
            console.log(`  ✅ ${exportData.key}`);
        }
    }

    // Update package.json
    packageJson.exports = newExports;

    // Update main and module for production
    const mainExport = newExports['.'];
    if (mainExport.require) {
        packageJson.main = mainExport.require;
    }
    if (mainExport.import) {
        packageJson.module = mainExport.import;
    }
    if (mainExport.types) {
        packageJson.types = mainExport.types;
    }

    // Write the updated package.json
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);

    console.log('✅ Exports generated successfully!');
    console.log(`📄 Updated exports for ${Object.keys(newExports).length} entries`);
}

// Run the script
try {
    generateExports();
} catch (error) {
    console.error('❌ Error generating exports:', error.message);
    process.exit(1);
}
