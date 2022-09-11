http = require('http');
fs = require('fs');

port = 8792;
host = '0.0.0.0';
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
            
            if ((!parsed.map) || (parsed.map.phase == "gameover")) {
                console.log("Deleting data for ", parsed.provider.steamid);
                delete lastMessage[parsed.provider.steamid];
            } else {
                parsed.lastUpdated = new Date();

                if (! lastMessage[parsed.provider.steamid]) {
                    lastMessage[parsed.provider.steamid] = [];
                }
    
                providerMessages = lastMessage[parsed.provider.steamid];
                // providerMessages.push(parsed);
                providerMessages = new Array(parsed);
                
                if (parsed.map){
                    console.log("DEBUG: providerId=", parsed.provider.steamid, " CT - T : ", parsed.map.team_ct.score, "-", parsed.map.team_t.score);
                }
    
                lastMessage[parsed.provider.steamid] = providerMessages;
                console.log("Provider ", parsed.provider.steamid ," records: ", providerMessages.length - 1);
            }
    
            res.end('');
        });
    }
    else if (req.method == 'GET') {
        console.log("Handling GET request...");

        // console.log("DEBUG in GET:", lastMessage);
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
