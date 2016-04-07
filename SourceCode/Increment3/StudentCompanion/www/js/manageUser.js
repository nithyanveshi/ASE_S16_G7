/**
 * Created by meets on 3/30/2016.
 */
var pwdMgr = require('./managePasswords');
module.exports = function (server, db) {
// unique index
    db.Login.ensureIndex({
        SSO: 1
    }, {
        unique: true
    })
    server.post('/api/v1/bucketList/auth/register', function (req, res, next) {
        var user = req.params;
        pwdMgr.cryptPassword(user.Password, function (err, hash) {
            user.Password = hash;
            console.log("n", hash);
            db.Login.insert(user,
                function (err, dbUser) {
                    if (err) { // duplicate key error
                        if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                            res.writeHead(400, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: err,
                                message: "A user with this email already exists"
                            }));
                        }
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        dbUser.Password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
        });
        return next();
    });
    server.post('/api/v1/bucketList/auth/login', function (req, res, next) {
        var user = req.params;
        if (user.SSO.trim().length == 0 || user.Password.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid Credentials"
            }));
        }
        console.log("in");
        db.Login.findOne({
            SSO: req.params.SSO
        }, function (err, dbUser) {
            pwdMgr.comparePassword(user.Password, dbUser.Password, function (err, isPasswordMatch) {
                console.log("inside comparePassword");
                console.log(user.Password+" "+dbUser.Password);
                if (isPasswordMatch) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
// remove password hash before sending to the client
                    dbUser.Password = "";
                    res.end(JSON.stringify(dbUser));
                } else {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "Invalid User"
                    }));
                }
            });
        });
        return next();
    });
};