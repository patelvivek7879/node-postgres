const http = require('http');
const { send } = require('process');

const port = process.env.PORT || 3300

const server = http.createServer((req, res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello World</h1>');
});

server.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});