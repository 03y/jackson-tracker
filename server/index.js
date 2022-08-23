// API Server
// Stores a JSON file with events
// Event example '{'type':'Event Type', 'time':'Event Time', 'author':'Event Author'}'

import fs from 'fs';
import http from 'http';

var server;
server = http.createServer(function (req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
});

const gets = [];
const posts = [];
let events = [];

const EventType = {
    Breakfast: 'Breakfast',
    Dinner: 'Dinner',
    Walk: 'Walk',
}

function Event(type, time, author) {
    this.type = type;
    this.time = time;
    this.author = author;
}

events = new Array();

// test
events.push(new Event(EventType.Breakfast, 1661253601, 'Kyle'));
events.push(new Event(EventType.Dinner, 1661253601, 'Kyle'));
events.push(new Event(EventType.Walk, 1661253601, 'Kyle'));

server.get = f => gets.push(f);
server.post = f => posts.push(f);

server.get((req, res) => {
    console.log('GET', req.url);
    
    // repsond with json data
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(events));
});

server.post((req, res) => {
    console.log('POST', req.url);
    
    // get body data
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        // parse body data
        let parsed = JSON.parse(body);

        // remove last event of that type
        let lastEvent = events.filter(e => e.type === parsed.type)[0];
        if (lastEvent) {
            events.splice(events.indexOf(lastEvent), 1);
        }

        // add new event
        events.push(new Event(parsed.type, parsed.time, parsed.author));

        // save json file
        fs.writeFileSync('events.json', JSON.stringify(events));
        // res.writeHead(200, {'Content-Type': 'application/json'});
    });

    res.end();
});

server.on('request', (req, res) => {
    if (req.method === 'GET') {
        gets.forEach(g => g(req, res));
    } else if (req.method === 'POST') {
        posts.forEach(p => p(req, res));
    }
});

server.listen(8080);
console.log('Server running on port 8080');
