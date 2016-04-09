/**
 * Created by meets on 3/30/2016.
 */
var bcrypt = require('bcrypt');
module.exports.cryptPassword = function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);
        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
};
module.exports.comparePassword = function (password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function (err, isPasswordMatch) {
        console.log(password+" "+userPassword);
        if (err){
            console.log("ERROR: "+err);
            return callback(err);
        }
        console.log("isPasswordMatch: "+isPasswordMatch);
        return callback(null, isPasswordMatch);
    });
};