#!/usr/bin/env node
var prerender = require('./lib');
var argv = require('minimist')(process.argv);
var debug = argv.debug||false;
var cache = argv.cache || process.env.PHANTOM_CACHE;
var options = {
    workers: argv.workers || process.env.PHANTOM_CLUSTER_NUM_WORKERS,
    iterations: process.env.PHANTOM_WORKER_ITERATIONS || 10,
    phantomBasePort: process.env.PHANTOM_CLUSTER_BASE_PORT || 3000,
    port: argv.port || process.env.PHANTOM_PORT,
    messageTimeout: process.env.PHANTOM_CLUSTER_MESSAGE_TIMEOUT,
    jsTimeout: argv['js-timeout'] || process.env.JS_TIMEOUT
}

var server = prerender(options);

// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
if (debug)
    server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.removeNgAttrs());
server.use(prerender.compressHtml());
server.use(prerender.httpHeaders());
switch(cache)
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
