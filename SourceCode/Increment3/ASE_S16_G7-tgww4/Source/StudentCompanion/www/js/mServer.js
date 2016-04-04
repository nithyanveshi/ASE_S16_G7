var restify = require('restify');
var mongojs = require('mongojs');
//var morgan = require('morgan');



var db = mongojs('mongodb://studentcompaniondb:studentcompaniondb@ds011399.mlab.com:11399/studentcompaniondb', ['Login', 'Address', 'Library', 'LibraryRooms']);

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(morgan('dev'));

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//var manageUsers = require('./manageUser')(server, db)


server.post('/login', function (req, res, next) {

    var user = req.params;
    if (user.SSO.trim().length == 0 || user.Password.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials"
        }));
    }

  console.log("Inside Server " + user.SSO + " " + user.Password);
    db.Login.findOne({SSO: req.params.SSO, Password: req.params.Password}, function (err, data) {
        if(err) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid User Credentials"
            }));
            console.log("Server: Invalid Credentials");
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
            console.log("Server: Success Login");
        }
    });
    //console.log("User found: " + Login, null, '\t');

    return next();
});

server.post('/library', function (req, res, next) {


   var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for Library details fetch"
        }));
    }
    else {
        console.log("Inside Library Server " + user.SSO);
        db.Library.findOne(function (err, data) {
            if(err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during Library details fetch"
                }));
                console.log("Server: Library details fetch error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("Server: Success Library fetch");
            }
        });
    }

    //console.log("User found: " + Login, null, '\t');

    return next();
});



server.post('/libRoomsList', function (req, res, next) {


  var user = req.params;
  if (req.params.SSO.trim().length == 0) {
    console.log("Inside if loop");
    res.writeHead(403, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify({
      error: "Error in mServer.js for Library rooms details fetch"
    }));
  }
  else {
    console.log("Inside Library Rooms Server " + user.SSO);
    db.LibraryRooms.find(function (err, data) {
      if(err) {
        res.writeHead(403, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
          error: "Error occured during Library Room details fetch"
        }));
        console.log("Server: Library Room details fetch error");
      }
      else {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
        console.log("Server: Success Library Rooms fetch");
      }
    });
  }

  //console.log("User found: " + Login, null, '\t');

  return next();
});


server.listen(9000, function () {
    console.log("Server started @ 9000");
});



server.get("/products", function (req, res, next) {
    db.Address.find(function (err, Address) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(Address, null, '\t'));
    });
    return next();
});