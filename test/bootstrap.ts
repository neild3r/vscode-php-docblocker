import * as path from 'path';



declare var __coverage__:any;

var istanbul = require('istanbul'),
    hook = istanbul.hook,
    collector = new istanbul.Collector(),
    instrumenter = new istanbul.Instrumenter(),
    reporter = new istanbul.Reporter(false, __dirname + '/../../coverage/'),
    sync = true;



hook.hookRequire(function(file) {
    return file.indexOf(path.resolve(__dirname + '/../..') + '/out/src') !== -1;
}, function(code, filename) {
    var ret = instrumenter.instrumentSync(code, filename);
    return ret;
});

// ));
// __coverage__ = {};


process.on('exit', () => {
    collector.add(__coverage__);
    reporter.add('lcovonly');
    reporter.write(collector, sync, function () {
        console.log('All reports generated');
    });
});
