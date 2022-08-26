http = require('http');
fs = require('fs');

port = 3000;
host = '127.0.0.1';
lastMessage = {};

server = http.createServer(function (req, res) {

    if (req.method == 'POST') {
        console.log("Handling POST request...");
        res.writeHead(200, { 'Content-Type': 'text/html' });

        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var parsed = JSON.parse(body);
            lastMessage = parsed;
            console.log("DEBUG in POST:", lastMessage);
            console.log("POST payload: " + body);
            res.end('');
        });
    }
    else if (req.method == 'GET') {
        console.log("Handling GET request...");
        console.log("DEBUG in GET:", lastMessage);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lastMessage));
    }
    else {
        console.log("Not expecting other request types...");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
        res.end(html);
    }

});

server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);