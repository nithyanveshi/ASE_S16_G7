/**
 * Created by meets on 3/30/2016.
 */
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'http://localhost:3000'
});

module.exports.loginStatus = function getLoginStatus(SSO, Password) {
  var user = {
    SSO: SSO,
    Password: Password
  };

    client.get('/login/' + user.SSO + '/' + user.Password, function (err, req, res, login) {
        if (err) {
            console.log("An error occurred >>>>>>");
            console.log(err);
            return err;
        } else {
            console.log("Login Length " + login.length);
            console.log('User details >>>>>>>');
            console.log(login);
            return "success";
        }
    });
}


//var user = {
//  SSO: 'SC9V9',
//  Password: 'password'
//};
//getLoginStatus(user.SSO, user.Password);
//console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
//console.log(user.SSO + "    " + user.Password);
//client.get('/login/'+ user.SSO + '/' + user.Password, function (err, req, res, login) {
//    if (err) console.log("Oops : ", err);
//    else console.log('Login length : ', login.length);
//    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
//});