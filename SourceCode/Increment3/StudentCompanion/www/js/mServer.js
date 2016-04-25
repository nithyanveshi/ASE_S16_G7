var restify = require('restify');
var mongojs = require('mongojs');
//var morgan = require('morgan');



var db = mongojs('mongodb://studentcompaniondb:studentcompaniondb@ds011399.mlab.com:11399/studentcompaniondb', ['Login', 'Address', 'Library', 'LibraryRooms', 'RoomReservation', 'SAShifts', 'Profile', 'Labs']);

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
            error: "Invalid Credentials in login"
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

server.post('/profile',function(req,res,next)  {
	var user = req.params;
	if(req.params.SSO.trim().length == 0){
		console.log("Inside if loop");
		res.writeHead(403,{
			'Content-Type':'application/json; charset=utf-8'
		});
		res.end(JSON.stringify({
			error:"Error in mServer.js for User profile details fetch"
		}));
	}
	else {
		console.log("Inside User Profile Server" + user.SSO);
		db.Profile.findOne(function(err,data) {
			if(err){
				res.writeHead(403,{
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify({
					error:"Error occured during User details fetch"
				}));
				console.log("Server: User Profile error");
			}				
			else
				{
					res.writeHead(200,{
						'Content-Type':'application/json; charset=utf-8'
					});
					res.end(JSON.stringify(data));
					console.log("Server:success Profile details fetch");
				}
		});
	}
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

server.post('/roomReserveList', function (req, res, next) {


    var user = req.params;
    var query = {};
    query["StartTime"] = new Date(user.selectedDate);
    //var selectedDate = req.params.selectedDate;
    if (req.params.SSO.trim().length == 0) {
        console.log("SSO is not set in roomReserveList");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for reserve rooms details fetch"
        }));
    }
    else {
        console.log("Inside Reserve Rooms Server " + user.SSO);
        db.RoomReservation.find(query, function (err, data) {
            if(err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during reserve Room details fetch"
                }));
                console.log("Server: reserve Room details fetch error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success reserve Rooms fetch" + data);
            }
        });
    }

    //console.log("User found: " + Login, null, '\t');

    return next();
});

server.post('/shifts', function (req, res, next) {


   var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for Shift details fetch"
        }));
    }
    else {
        console.log("Inside Shift Server " + user.SSO);
        db.SAShifts.find(function (err, data) {
            if(err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during Shifts details fetch"
                }));
                console.log("Server: Shift details fetch error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("Server: Success Shifts fetch"+data);
            }
        });
    }

    //console.log("User found: " + Login, null, '\t');

    return next();
});

server.post('/labs', function (req, res, next) {
   var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop - labs");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for Labs details fetch"
        }));
    }
    else {
        console.log("Inside Labs Server " + user.SSO);
        db.Labs.find(function (err, data) {
            if(err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during Labs details fetch"
                }));
                console.log("Server: Labs details fetch error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("Server: Success Labs fetch");
            }
        });
    }
//    console.log("User found: " + Login, null, '\t');
    return next();
});


server.post('/ownRoomReserveList', function (req, res, next) {


    var user = req.params;
    var query = {};
    query["Login_ID"] = user.SSO;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for own reserve rooms details fetch"
        }));
    }
    else {
        console.log("Inside Own Reserve Rooms Server " + user.SSO);
        db.RoomReservation.find(query, function (err, data) {
            if(err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during own reserve Room details fetch"
                }));
                console.log("Server: own reserve Room details fetch error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success own reserve Rooms fetch");
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