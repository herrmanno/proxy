#!/usr/bin/env node

import * as Http from "http"
import * as HttpProxy from "http-proxy"
import * as Express from "express"

// Name -> Port Mapping
let map = new Map<string, number>();

// CONFIG SERVER
let app = Express();
app.post("/:name/:port", (req, res) => {
    map.set(req.params.name, req.params.port);
    res.status(200).end();
});
app.delete("/:name", (req, res) => {
    map.delete(req.params.name);
    res.status(200).end();
});
app.listen(3001);

// PROXY SERVER
let proxy = HttpProxy.createProxyServer({});
let proxyServer = Http.createServer((req, res) => {
    try {
        let name = req.url.match(/\/([^/]+)/)[1];
        let port = map.get(name);
        
        if(name && port) {
            let target = {
                target: `http://127.0.0.1:${port}`
            }
            req.url = req.url.substring(name.length + 1);
            proxy.web(req, res, target);
        }
        else {
            res.statusCode = 404;
            res.end("Not found");
        }
    } catch(e) {
        res.statusCode = 500;
        res.end("An error occured");
    }
});
proxy.on('error', (err, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});


proxyServer.listen(3000);