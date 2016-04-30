var restify = require('restify');
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;
//var morgan = require('morgan');


var db = mongojs('mongodb://studentcompaniondb:studentcompaniondb@ds011399.mlab.com:11399/studentcompaniondb', ['Login', 'Address', 'Library', 'LibraryRooms', 'RoomReservation', 'SAShifts', 'Profile', 'Labs', 'Holidays', 'LibraryHours', 'Enrollments', 'Dues']);

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(morgan('dev'));

server.use(function (req, res, next) {
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
        if (err) {
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
server.post('/editUserPassword',function(req,res,next){
    var user = req.params;
    if (user.SSO.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in login"
        }));
    }
   
        console.log("Inside Server " + user.SSO);
    console.log("old password " + req.params.Password);
        db.Login.update({"SSO":user.SSO},{$set:{"Password":req.params.Password}},
                       {returnNewDocument:true},function(err,data){
                                if(err){
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

    return next();
});
server.post('/registerUser',function(req,res,next){
     var user = req.params;
    if (user.SSO.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in login"
        }));
    }
 console.log("Inside Server ");  db.Profile.insert({SSO:user.SSO,FirstName:user.FirstName,LastName:user.LastName,DOB:user.DOB,MobileNo:user.MobileNo,Email:user.Email,Address1:user.Address1,Address2:user.Address2,City:user.City,State:user.State,ZipCode:user.ZipCode},function(err,data){
                                if(err){
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
    db.Login.insert({SSO:user.SSO,Password:user.Password},function(err,data){
                                if(err){
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

return next();    
});

server.post('/editUserProfile', function(req,res,next) {
    
    var user = req.params;
    if (user.SSO.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in login"
        }));
    }
 
    console.log("Inside Server " + user.SSO);
    db.Profile.update({"SSO": user.SSO},{$set:{"MobileNo":req.params.MobileNo,"Address1":req.params.Address1,"Address2":req.params.Address2,"City":req.params.City,"State":req.params.State,"ZipCode":req.params.ZipCode}},{returnNewDocument:true},function(err,data){
                                if(err){
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
 
return next();    
});


server.post('/cacheUserProfile', function (req, res, next) {

    var user = req.params;
    if (user.SSO.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in login"
        }));
    }

    console.log("Inside Server " + user.SSO);
    db.Profile.findOne({"SSO": req.params.SSO}, function (err, data) {
        if (err) {
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


server.post('/getEnrollments', function (req, res, next) {


    var user = req.params;
    var sem = "";
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Error in getEnrollments for enrollment details fetch"
        }));
    }
    else {
        if (["Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(user.month) >= 0) {
            sem = "Fall";
        }
        else if (["Jan", "Feb", "Mar", "Apr", "May"].indexOf(user.month) >= 0) {
            sem = "Spring";
        }
        else if (["Jun", "Jul"].indexOf(user.month) >= 0) {
            sem = "Summer";
        }
        console.log("mServer.js: Inside getEnrollments " + user.SSO);
        console.log("mServer.js: Inside getEnrollments: Semester: " + sem + ", Year: " + user.year);
        db.Enrollments.find({"SSO": user.SSO, "Semester": sem, "Year": parseInt(user.year)}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during Enrollment details fetch"
                }));
                console.log("mServer.js: Error occured during Enrollment details fetch");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success Enrollment Details fetch");
            }
        });
    }

    return next();
});


server.post('/getDues', function (req, res, next) {


    var user = req.params;
    var sem = "";
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Error in getDues for Dues details fetch"
        }));
    }
    else {
        if (["Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(user.month) >= 0) {
            sem = "Fall";
        }
        else if (["Jan", "Feb", "Mar", "Apr", "May"].indexOf(user.month) >= 0) {
            sem = "Spring";
        }
        else if (["Jun", "Jul"].indexOf(user.month) >= 0) {
            sem = "Summer";
        }
        console.log("mServer.js: Inside getDues " + user.SSO);
        console.log("mServer.js: Inside getDues: Semester: " + sem + ", Year: " + user.year);
        db.Dues.find({"SSO": user.SSO, "Semester": sem, "Year": parseInt(user.year)}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during Dues details fetch"
                }));
                console.log("mServer.js: Error occured during Dues details fetch");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                for(var i=0; i<data.length; i++) {
                    console.log(JSON.stringify(data[i]));
                }
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success Dues Details fetch");
            }
        })
    }

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
            if (err) {
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

server.post('/profile', function (req, res, next) {
    var user = req.params;
    var query = {};
    query["SSO"] = user.SSO;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Error in mServer.js for User profile details fetch"
        }));
    }
    else {
        console.log("Inside User Profile Server" + user.SSO);

        db.Profile.findOne(query, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during User details fetch"
                }));
                console.log("Server: User Profile error");
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("Server:success Profile details fetch");
            }
        });
    }
    return next();
});


server.post('/getLibraryHours', function (req, res, next) {

    var user = req.params;
    if (user.SSO.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in getLibraryHours"
        }));
    }

    console.log("Inside Server " + user.SSO);
    db.LibraryHours.findOne({"StartTime": {$regex: user.selectedDate}}, function (err, data) {
        if (err) {
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


server.post('/libRoomsList', function (req, res, next) {


    var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid session"
        }));
    }
    else {
        console.log("mServer.js: Inside Library Rooms Server " + user.SSO);
        db.LibraryRooms.find(function (err, data) {
            if (err) {
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
    query[new Date("StartTime")] = new Date(user.selectedDate);
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
        console.log("mServer.js: Inside Reserve Rooms Server User: " + user.SSO + " SelectedDate: " + user.selectedDate);
        console.log("mServer.js: Inside Reserve Rooms Server Selected Date: " + user.selectedDate);
        console.log("mServer.js: Inside Reserve Rooms Server Selected Room Number: " + user.selectedRoomNo);
        db.RoomReservation.find({
            "StartTime": {$regex: user.selectedDate},
            "Room_ID": user.selectedRoomNo.toString(),
            "Status": "Active"
        }, function (err, data) {
            if (err) {
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
        console.log("mServer.js: Inside Shift Server  User: " + user.SSO + " SelectedDate: " + user.selectedDate);
        console.log("mServer.js: Inside Shift Server Selected Date: " + user.selectedDate);
        db.SAShifts.find({"Profile_ID": req.params.SSO,"Date": {$regex: user.selectedDate}},function (err, data) {
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
server.post('/subs', function (req, res, next) {


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
        console.log("Inside Sub Server " + user.SSO);
        console.log("mServer.js: Inside Sub Server  User: " + user.SSO + " SelectedDate: " + user.selectedDate);
        console.log("mServer.js: Inside Sub Server Selected Date: " + user.selectedDate);
        db.SAShifts.find({"Date": {$regex: user.selectedDate},"IsSubstitution": "Yes","IsTaken": "No"},function (err, data) {
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
                console.log("Server: Success Shifts fetch" + data);
            }
        });
    }

    //console.log("User found: " + Login, null, '\t');

    return next();
});

server.post('/updateFullShift', function (req, res, next) {
    var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid Session"
        }));
    }
    else {
        console.log("mServer.js: Inside updateFullShift SSO: " + user.SSO);
        console.log("mServer.js: Inside updateFullShift Date: " + user.Date + ", Start: " + user.Start + ", End: "
        + user.End + ", Location: " + user.Location);

        db.SAShifts.insert({"Profile_ID": user.SSO, "Date": user.Date, "Start": user.Start, "End": user.End, "Location": user.Location,
            "IsSubstitution": "No", "IsTaken": "Yes"}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during SA Shift substitution"
                }));
                console.log("mServer.js: SA Shift substitution error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success SA shift substitution: " + JSON.stringify(data));
            }
        });
    }
});


server.post('/updateOwnerFullShift', function (req, res, next) {
    var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid Session"
        }));
    }
    else {
        console.log("mServer.js: Inside updateOwnerFullShift SSO: " + user.SSO);
        console.log("mServer.js: Inside updateOwnerFullShift Shift ID: " + user.ShiftPostedID);

        db.SAShifts.update({"_id": ObjectId(user.ShiftPostedID)},{$set: {"IsSubstitution": "Yes", "IsTaken": "Yes"}}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during Owner shift removal"
                }));
                console.log("mServer.js: Owner shift removal error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success Owner shift removal: " + JSON.stringify(data));
            }
        });
    }
});

server.post('/insertHalfShift', function (req, res, next) {
    var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid Session"
        }));
    }
    else {
        console.log("mServer.js: Inside insertHalfShift SSO: " + user.SSO);
        //console.log("mServer.js: Inside insertHalfShift Shift ID: " + user.ShiftPostedID);

        db.SAShifts.insert({"Profile_ID": user.SSO, "Date": user.Date, "Start": user.Start, "End": user.End, "Location": user.Location,
            "IsSubstitution": user.IsSubstitution, "IsTaken": user.IsTaken}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during partial shift adding"
                }));
                console.log("mServer.js: Partial shift adding error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success Added partial shift: " + JSON.stringify(data));
            }
        });
    }
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
            if (err) {
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

server.post('/cancelReservation', function (req, res, next) {
    var user = req.params;
    var query = {};
    query["Login_ID"] = user.SSO;
    if (req.params.SSO.trim().length == 0) {
        console.log("Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid Session"
        }));
    }
    else {
        console.log("mServer.js: Inside cancelReservation SSO: " + user.SSO);
        console.log("mServer.js: Inside cancelReservation Romm ID: " + user.reservationID);

        db.RoomReservation.update({_id: ObjectId(user.reservationID)}, {$set: {"Status": "Cancelled"}}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during cancellation of room reservation"
                }));
                console.log("mServer.js: Reserved room cancellation error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success reserved room cancellation: " + JSON.stringify(data));
            }
        });
    }
});

server.post('/newRoomReservation', function (req, res, next) {

    var user = req.params;
    if (user.Login_ID.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials in login"
        }));
    }
    console.log("mServer.js: Reserving the room with the following details....");
    console.log("mServer.js: Login_ID: " + user.Login_ID);
    console.log("mServer.js: Room_ID: " + user.Room_ID);
    console.log("mServer.js: StartTime: " + user.StartTime);
    console.log("mServer.js: EndTime: " + user.EndTime);
    console.log("mServer.js: Status: " + user.Status);
    console.log("mServer.js: ReservedFor: " + user.ReservedFor);
    console.log("mServer.js: Email: " + user.Email);
    console.log("mServer.js: Mobile: " + user.Mobile);

    db.RoomReservation.insert({
        "Room_ID": user.Room_ID, "StartTime": user.StartTime, "EndTime": user.EndTime, "Login_ID": user.Login_ID,
        "Status": user.Status, "ReservedFor": user.ReservedFor, "Email": user.Email, "Mobile": user.Mobile
    }, function (err, data) {
        if (err) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "mServer.js: Unable to insert new record for room reservation"
            }));
            console.log("mServer.js: Unable to insert new record for room reservation");
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
            console.log("mServer.js: Successfully reserved the room");
        }
    });
    //console.log("User found: " + Login, null, '\t');

    return next();
});


server.post('/getHolidays', function (req, res, next) {
    var user = req.params;
    if (req.params.SSO.trim().length == 0) {
        console.log("mServer.js: getHolidays: Inside if loop");
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "mServer.js: Invalid Session"
        }));
    }
    else {
        console.log("mServer.js: Inside getHolidays: SSO: " + user.SSO);

        db.Holidays.find({}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "mServer.js: Error occured during Holidays details fetch"
                }));
                console.log("mServer.js: Holidays details fetch error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                console.log("mServer.js: Success Holidays details fetch: " + JSON.stringify(data));
            }
        });
    }
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
        db.RoomReservation.find({"Login_ID": user.SSO, "Status": "Active"}, function (err, data) {
            if (err) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Error occured during own reserve Room details fetch"
                }));
                console.log("Server: own reserve Room details fetch error");
            }
            else {
                //var lData = data.toArray();
                //console.log("Data is: " + lData);
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
