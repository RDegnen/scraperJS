const http = require('http');
const httpProxy = require('http-proxy');

const options = {
  target: 'http://localhost:9000'
};

httpProxy.createProxyServer(options).listen(8000);

http.createServer((req, res) => {
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log(body)
  })
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);
