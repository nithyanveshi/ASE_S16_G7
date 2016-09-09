var restify = require('restify');
var mongojs = require('mongojs');
var httpProxy       = require('http-proxy');
var proxy = httpProxy.createServer({
    target:'http://localhost:10005'
});

proxy.listen(10005);

var db;
function connect() {
    db = mongojs('mongodb://studentcompanion:studentcompanion@ds019628.mlab.com:19628/studentcompaniondb', ['products']);
    return db;
}

connect();

// Server
var server = restify.createServer(proxy);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get("/products", function (req, res, next) {
    proxy.proxyRequest(req, res,{
        host: 'localhost',
        port: 3000}),
    db.products.find(function (err, products) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(products));
    });
    return next();
});

server.get('/product/:id', function (req, res, next) {
    db.products.findOne({
        id: req.params.id
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

server.post('/product', function (req, res, next) {
    var product = req.params;
    db.products.save(product,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

server.put('/product/:id', function (req, res, next) {
    // get the existing product
    db.products.findOne({
        id: req.params.id
    }, function (err, data) {
        // merge req.params/product with the server/product

        var updProd = {}; // updated products 
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
            updProd[n] = data[n];
        }
        for (var n in req.params) {
            updProd[n] = req.params[n];
        }
        db.products.update({
            id: req.params.id
        }, updProd, {
            multi: false
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    });
    return next();
});

server.del('/product/:id', function (req, res, next) {
    db.products.remove({
        id: req.params.id
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(true));
    });
    return next();
});

server.listen(3000, function () {
    console.log("Server started @ 3000");
});

module.exports = server;