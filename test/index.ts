import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export async function run(): Promise<void> {
    const NYC = require('nyc');
    const nyc = new NYC({
      cwd: path.join(__dirname, '..', '..'),
      exclude: ['**/test/**', '.vscode-test/**'],
      reporter: ['json', 'lcov'],
      extension: ['ts'],
      all: true,
      instrument: true,
      hookRequire: true,
      hookRunInContext: true,
      hookRunInThisContext: true,
    });

    nyc.reset();
    nyc.wrap();


    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd',
    });

    const testsRoot = path.resolve(__dirname, '..');

    try {
        await new Promise((c, e) => {
            glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
                if (err) {
                    return e(err);
                }

                // Add files to the test suite
                files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

                try {
                    // Run the mocha test
                    mocha.run(failures => {
                        if (failures > 0) {
                            e(new Error(`${failures} tests failed.`));
                        } else {
                            c();
                        }
                    });
                } catch (err) {
                    e(err);
                }
            });
        });
    } finally {
        nyc.writeCoverageFile();
        nyc.report();
    }
}
