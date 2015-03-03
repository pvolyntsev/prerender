#!/usr/bin/env node
var prerender = require('./lib');

var options = {
    cache: process.argv.cache || process.env.PHANTOM_CACHE,
    workers: process.argv.workers || process.env.PHANTOM_CLUSTER_NUM_WORKERS,
    iterations: process.env.PHANTOM_WORKER_ITERATIONS || 10,
    phantomBasePort: process.argv.port || process.env.PHANTOM_CLUSTER_BASE_PORT || 3000,
    messageTimeout: process.env.PHANTOM_CLUSTER_MESSAGE_TIMEOUT
}

var server = prerender(options);

// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
if (process.argv.debug||false)
    server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.removeNgAttrs());
server.use(prerender.compressHtml());
server.use(prerender.httpHeaders());
switch(options.cache)
{
    case 'memory':
        server.use(prerender.inMemoryHtmlCache());
        break;
    case 's3':
        server.use(prerender.s3HtmlCache());
        break;
    case 'file':
        server.use(require('prerender-file-cache'));
}
server.start();
