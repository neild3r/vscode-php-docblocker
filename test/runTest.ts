import * as path from 'path';

import { runTests,downloadAndUnzipVSCode } from 'vscode-test';

async function main() {
    try {
        var vscodeExecutablePath = await downloadAndUnzipVSCode('1.35.0')
    } catch (err) {
        console.error(err);
    }

    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');

        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './index');

        // Download VS Code, unzip it and run the integration test
        await runTests({ vscodeExecutablePath, extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        console.error(err);
        process.exit(1);
    }
}

main();
