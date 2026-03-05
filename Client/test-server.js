const http = require('http');
const server = http.createServer((req, res) => res.end('test'));
server.listen(4000, () => console.log('Listening on 4000'));
