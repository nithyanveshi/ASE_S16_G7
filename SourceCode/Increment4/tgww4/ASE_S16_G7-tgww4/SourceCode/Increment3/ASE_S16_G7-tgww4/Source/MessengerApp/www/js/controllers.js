

angular.module('starter.controllers', ['ngSanitize','ngTwitter'])

//*************************************//

.controller('LoginCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {

        // $scope.data = {};
       var count=0;
    var remcount=3;
    var flag=1;
       $scope.pageClass = 'home';
    $scope.home = function() {
        console.log("home page !");
        $state.go('home');
    }
        $scope.pageClass = 'login';
        $scope.login = function(username, password) {
          //console.log("inside login function");
          inside.getMethod();
          $http({
            method: 'GET',
            url: 'https://api.mongolab.com/api/1/databases/tutorial7db/collections/Loginrecords?apiKey=m5DSZnJ2Orak0zfBxZGRQ_7KgjrTchjB',

            contentType: "application/json"
          }).success(function (response) {
            var list = response;

            for (var i = 0; i < list.length; i++) {
              if (angular.equals(list[i].username, username) && angular.equals(list[i].password, password)) {

                localStorage.setItem("username", list[i].username);
                localStorage.setItem("password", list[i].password);
                localStorage.setItem("id_user", list[i]._id.$oid);
                localStorage.setItem("email", list[i].email);
                localStorage.setItem("lnAccessToken", list[i].lnAccessToken);
                localStorage.setItem("twitterAccessToken", JSON.stringify(list[i].twitterAccessToken));
                localStorage.setItem("instagramAccessToken", list[i].instagramAccessToken);
                localStorage.setItem("fb", list[i].fbtoken);
                localStorage.setItem("question", list[i].question);
                localStorage.setItem("answer", list[i].answer);

                localStorage.setItem("frequency", parseInt(list[i].frequency)+1);
                $scope.storefrequency();


                //alert("Login success");
                //location.href="home.html";
                console.log("inside if loop");
                flag = 0;
                $state.go('home');

              } else {
                //alert("Incorrect username/password");
                console.log("inside else loop");
                count++;
                /* count ++;
                 var remcount=3-count;
                 alert("Attempts remaining  "+remcount);
                 if(count==3){
                 alert("Please try again");
                 $window.close();

                 ionic.Platform.exitApp();
                 }*/
                //document.getElementById('x').innerHTML = "<P>Invalid Creditials! Please try again....</p>";
              }
            }

            if (count == list.length) {
              // alert("hiii");
              /*  remcount--;
               alert("Attempts remaining  "+remcount);
               if(remcount==0){
               alert("Please try again");
               $window.close();

               ionic.Platform.exitApp();
               }*/
              document.getElementById('x').innerHTML = "<P>Invalid Creditials! Please try again....</p>";
            }
          })
$scope.storefrequency=function(){
  var  username=localStorage.getItem("username");
  var password=localStorage.getItem("password");
  var email=localStorage.getItem("email");
  var id = localStorage.getItem("id_user");
  var lntoken=  localStorage.getItem("lnAccessToken");
  var instagramkey =localStorage.getItem("instagramAccessToken");
  var twitterAccesskey= JSON.parse($window.localStorage.getItem("twitterAccessToken"));
  var question=localStorage.getItem("question");
  var answer=localStorage.getItem("answer");
  var frequency= localStorage.getItem("frequency");
  var fbtoken=localStorage.getItem("fbtoken");
  //console.log("inside update function");
  $http({
    method: 'PUT',
    url: 'https://api.mongolab.com/api/1/databases/tutorial7db/collections/Loginrecords?apiKey=m5DSZnJ2Orak0zfBxZGRQ_7KgjrTchjB',
    data: JSON.stringify({
      username: username,
      password: password,
      email: email,
      lnAccessToken:lntoken,
      instagramAccessToken:instagramkey,
      twitterAccessToken:twitterAccesskey,
      fbtoken:fbtoken,
      question:question,
      answer:answer,
      frequency:frequency
    }),

    contentType: "application/json"


  }).success(function() {
    //$scope.username = "";
    //$scope.password = "";
    //$scope.email = "";
    // $scope.lnAccessToken = "";
   // alert(" ");
    console.log("navigating to home page from update page");
    //$state.go('home');
  })
}
          //$state.go('firebase');
          //location.href="templates/firebase.html";
          /*if (flag==1) {
            remcount--;
            alert("Remaining Attempts :  " + remcount);
            if (remcount == 0) {
              alert("Please try again... Bye... Bye...");
              var id = localStorage.getItem("id_user");
              $http({
                method: 'DELETE',
                url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

                contentType: "application/json"
              }).success(function() {
                alert("Delete success!");
                $state.go('login');
              })
            }
          }*/
        }
    })
    //*************************************//
    //end of login controller

//begin of register controller
.controller('RegisterCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
        // $scope.data = {};
       $scope.pageClass = 'home';
    $scope.home = function() {
        console.log("home page !");
        $state.go('home');
    }
        $scope.pageClass = 'register';
        $scope.register = function(username, password, email,question,answer) {
            // $state.go('home');
            inside.postMethod();
          var freq=0;
            //console.log("inside register function");
            $http({
                method: 'POST',
                url: 'https://api.mongolab.com/api/1/databases/tutorial7db/collections/Loginrecords?apiKey=m5DSZnJ2Orak0zfBxZGRQ_7KgjrTchjB',
                data: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    lnAccessToken:'',
                    twitterAccessToken:'',
                    instagramAccessToken:'',
                    fbtoken:'',
                  question:question,
                  answer:answer,
                  frequency:freq
                }),
                contentType: "application/json"
            }).success(function() {
                $scope.username = "";
                $scope.password = "";
                $scope.email = "";

                alert("User created successfully ");
                $state.go('login');
                //$scope.msg ="User created successfully";
                //$window.location.href="index.html";
            })

        }
    })
    //end of register controller

//beginning of home controller
.controller('HomeCtrl', function($scope, $state) {
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }
    $scope.data = {};
    $scope.pageClass = 'profile';
    $scope.profile = function() {
        console.log("inside profile page");
        $state.go('profile');
    }
     $scope.pageClass = 'twitterAuth';
    $scope.twitterAuth = function() {
        console.log("inside twitter auth page");
        $state.go('twitter');
    }
  $scope.pageClass = 'twitterUser';
  $scope.twitterUser = function() {
    console.log("inside twitter user page");
    $state.go('demo');
  }

    $scope.addaccountspage = function() {
      console.log("inside twitter user page");
      $state.go('accounts');
    }
    $scope. direct_linkedin = function() {
      console.log("inside twitter user page");
      $state.go('linkedinProfile');
    }
    $scope.pageClass = 'fbAuth';
    $scope.fbAuth = function() {
      console.log("inside fb user page");
      $state.go('fb');
    }
    $scope.frequentusers = function() {
      console.log("inside fb user page");
      $state.go('frequencylist');
    }


    var storageFactory = new StorageFactory();
    var localstorage = storageFactory.createStorage({});
    $scope.username1 = localstorage.username;
  //  var adminName = Admin.getInstance();
    //console.log(user.fullName()); // true
  //  $scope.firstname = adminName.firstName;
  //  $scope.lastname = adminName.lastName;

})

//end of home controller
//
  .controller('forgotCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {

    $scope.pageClass = 'home';
    $scope.home = function() {
      console.log("home page !");
      $state.go('login');
    }

    $scope.submitAnswer = function(username) {
      //console.log("inside login function");
      //inside.getMethod();
      $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/tutorial7db/collections/Loginrecords?apiKey=m5DSZnJ2Orak0zfBxZGRQ_7KgjrTchjB',

        contentType: "application/json"
      }).success(function(response) {
        var list = response;
        for (i = 0; i < list.length; i++) {
          if ((list[i].username == username)) {
            localStorage.setItem("username", list[i].username);
            localStorage.setItem("password", list[i].password);
            localStorage.setItem("id_user", list[i]._id.$oid);
            localStorage.setItem("email", list[i].email);
            localStorage.setItem("lnAccessToken", list[i].lnAccessToken);
            localStorage.setItem("twitterAccessToken", JSON.stringify(list[i].twitterAccessToken));
            localStorage.setItem("instagramAccessToken", list[i].instagramAccessToken);
            localStorage.setItem("fb", list[i].fbtoken);
            localStorage.setItem("question", list[i].question);
            localStorage.setItem("answer", list[i].answer);
            localStorage.setItem("frequency", list[i].frequency);
            //alert("Login success");
            //location.href="home.html";
            console.log("inside if loop");
            alert(username);
            $state.go('security');
            //alert(_id.$oid);
          } else {
            //alert("Incorrect username/password");
            console.log("inside else loop");
            //document.getElementById('x').innerHTML = "<P>Invalid Creditials! Please try again....</p>";
            $state.go('login');
          }
        }
      })
    }

  })
  //end of forgot controller

  //begin of reset controller
  .controller("resetCtrl", function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
    $scope.pageClass = 'home';
    $scope.home = function() {
      console.log("home page !");
      $state.go('login');
    }
    $scope.pageClass = 'reset';
    $scope.reset = function(password,cpassword) {

      if(password==cpassword){
        //inside.putMethod();
        var id = localStorage.getItem("id_user");
        var  username=localStorage.getItem("username");
        //var password=password;
        var email=localStorage.getItem("email");
        var  question=localStorage.getItem("question");
        var  answer=localStorage.getItem("answer");
        var twitterAccesskey= JSON.parse($window.localStorage.getItem("twitterAccessToken"));
       // var password=localStorage.getItem("password");

        var lntoken=  localStorage.getItem("lnAccessToken");
        var instagramkey =localStorage.getItem("instagramAccessToken");
        var fbkey =localStorage.getItem("fbtoken");
       var frequency= localStorage.getItem("frequency");

        //console.log("inside update function");
       /* $http({
          method: 'PUT',
          url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
          data: JSON.stringify({
            username: username,
            password: password,
            email: email,
            lnAccessToken:lntoken,
            instagramAccessToken:instagramkey,
            twitterAccessToken:twitterAccesskey,
            fbtoken:fbkey
          }),

          contentType: "application/json"


        }).success(function() {

          alert("update successful");
          console.log("navigating to home page from update page");
         // $state.go('login');
        })*/
        $http({
          method: 'PUT',
          url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
          data: JSON.stringify({
            "username": username,
            "password": password,
            "email": email,
            lnAccessToken:lntoken,
            instagramAccessToken:instagramkey,
            twitterAccessToken:twitterAccesskey,
            fbtoken:fbkey,
            question:question,
            answer:answer,
            frequency:frequency
          }),

          contentType: "application/json"


        }).success(function() {
          $scope.username = "";
          $scope.password = "";
          $scope.email = "";
          $scope.question = "";
          $scope.answer = "";
          alert("update successful");
          console.log("navigating to home page from update page");
          $state.go('login');
        })
      }
      else{
        console.log("inside reset else");
        document.getElementById('x').innerHTML = "<P>Password do not match! Please try again....</p>";
        $state.go('reset');
      }

    }

  })
  //end of reset controller


  //begin of security controller
  .controller('securityCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {

    $scope.pageClass = 'home';
    $scope.home = function() {
      console.log("home page !");
      $state.go('login');
    }
    alert("hi");
    //var securityQuestion="";
    var id = localStorage.getItem("id_user");
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function(response) {
      //securityQuestion= response.question;
      alert(response.question);
      $scope.mySecurityQuestion = JSON.stringify(response.question);
    });

    $scope.pageClass = 'securityAnswer';
    $scope.securityAnswer = function(answer) {
      console.log("inside security answer function");
      //inside.getMethod();
      $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

        contentType: "application/json"
      }).success(function(response) {
        var list = response;
        if ((list.answer == answer)){
          console.log("inside if loop");
          alert("success");
          $state.go('reset');
        } else {
          //alert("Incorrect username/password");
          console.log("inside else loop");
          alert("Incorrect details....");
          $state.go('security');
          //document.getElementById('x').innerHTML = "<P>Password do not match! Please try again....</p>";
        }

      })
    }
  })
  //end of security controller


//beginning of linkedin controller
  .controller('linkedinCtrl', function($scope, $http,$window, $httpParamSerializerJQLike, $state) {
var lntoken;
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }
    var id=localStorage.getItem("id_user");
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function(response) {
      lntoken= response.lnAccessToken;
    // alert(response.lnAccessToken);
      $scope.get_linkedinDetails(lntoken);

    })

    $scope.get_linkedinDetails = function(lntoken) {
      console.log("inside ln details");
    // alert(lntoken);

      $http({
        method: 'GET',
        url : 'https://api.linkedin.com/v1/people/~?format=json&oauth2_access_token='+lntoken
      }).success(function(data) {
       // alert(data);
        var obj=angular.fromJson(data);
        $scope.linkedin_data = data;
       // alert(obj.firstName);
      })
      $http({
        method: 'GET',
        url : 'https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)?format=json&oauth2_access_token='+lntoken
      }).success(function(data) {
        var obj=angular.fromJson(data);
        $scope.linkedin_imgconndata = data;
      //  alert(obj.firstName);
      })
    };

    $scope.hreflink = function(lntoken) {
      console.log("inside ln details");
      //alert(lntoken);
      $window.open($scope.linkedin_data.siteStandardProfileRequest.url, '_blank', 'location=no');

    };

   /**/

  })

//end of linkedin controller



  //begin of accounts
  .controller('accountsCtrl', function($scope, $http,$cordovaOauth,$ionicPlatform,$twitterApi,$window, $httpParamSerializerJQLike, $state) {
    $scope.vm = {};
    var id=localStorage.getItem("id_user");
    //start of twitter account
    $scope.vm.myChkModeltwitter=false;
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }


    //start of linkedin account

    var ln_accesstoken;

      $scope.vm.myChkModel=false;

      $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

        contentType: "application/json"
      }).success(function(response) {
        var lntoken= response.lnAccessToken;
        if(lntoken===null || lntoken===''){
          $scope.vm.myChkModel=false;
        }
        else{
          $scope.vm.myChkModel=true;
        }
        //twitter
        var twittertoken= response.twitterAccessToken;
        if(twittertoken===null || twittertoken===''){
          $scope.vm.myChkModeltwitter=false;
        }
        else{
          $scope.vm.myChkModeltwitter=true;
        }
        //instagram
        var instagramtoken= response.instagramAccessToken;
        if(instagramtoken===null || instagramtoken===''){
          $scope.vm.myChkModelinsta=false;
        }
        else{
          $scope.vm.myChkModelinsta=true;
        }
        //facebook
        var fbtoken= response.fbtoken;
        if(fbtoken===null || fbtoken===''){
          $scope.vm.myChkModelfb=false;
        }
        else{
          $scope.vm.myChkModelfb=true;
        }
        // alert(response.lnAccessToken);
       // $scope.get_linkedinDetails(lntoken);

      })

    //facebook
    $scope.vm.myClickfb = function($event) {

      if($event) {
        $cordovaOauth.facebook("1702496219986153", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function (result) {
         // $scope.displayData($http, result.access_token);
          //alert(result.access_token);
          // $scope.text=JSON.stringify(result.access_token);
          //alert(text);
          $scope.storefbtoken(result.access_token);
        }, function (error) {
          alert("Error: " + error);
        });
        var id = localStorage.getItem("id_user");

        $scope.storefbtoken = function(fbtoken) {
          //inside.putMethod();
          var id = localStorage.getItem("id_user");
          var  username=localStorage.getItem("username");
          var password=localStorage.getItem("password");
          var email=localStorage.getItem("email");
          var lntoken=  localStorage.getItem("lnAccessToken");
          var instagramkey =localStorage.getItem("instagramAccessToken");
          var twitterAccesskey= JSON.parse($window.localStorage.getItem("twitterAccessToken"));
          var question=localStorage.getItem("question");
          var answer=localStorage.getItem("answer");
         var frequency= localStorage.getItem("frequency");

          localStorage.setItem("fbtoken",fbtoken);
          //console.log("inside update function");
          $http({
            method: 'PUT',
            url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
            data: JSON.stringify({
              username: username,
              password: password,
              email: email,
              twitterAccessToken:twitterAccesskey,
              lnAccessToken:lntoken,
              instagramAccessToken:instagramkey,
              fbtoken:fbtoken,
              question:question,
              answer:answer,
              frequency:frequency
            }),

            contentType: "application/json"


          }).success(function() {
            // $scope.username = "";
            //$scope.password = "";
            //$scope.email = "";
            //$scope.twitterAccessToken = "";
            alert("Added successful");
            console.log("navigating to home page from update page");
            //$state.go('home');
          })
        };


      }
      else{
        var  username=localStorage.getItem("username");
        var password=localStorage.getItem("password");
        var email=localStorage.getItem("email");
        var id = localStorage.getItem("id_user");
        var lntoken=  localStorage.getItem("lnAccessToken");
        var instagramkey =localStorage.getItem("instagramAccessToken");
        var twitterAccesskey= JSON.parse($window.localStorage.getItem("twitterAccessToken"));
        var question=localStorage.getItem("question");
        var answer=localStorage.getItem("answer");
        var frequency= localStorage.getItem("frequency");
        localStorage.setItem("fbtoken",'');
        //console.log("inside update function");
        $http({
          method: 'PUT',
          url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
          data: JSON.stringify({
            username: username,
            password: password,
            email: email,
            lnAccessToken:lntoken,
            instagramAccessToken:instagramkey,
            twitterAccessToken:twitterAccesskey,
            fbtoken:'',
            question:question,
            answer:answer,
            frequency:frequency
          }),

          contentType: "application/json"


        }).success(function() {
          //$scope.username = "";
          //$scope.password = "";
          //$scope.email = "";
          // $scope.lnAccessToken = "";
          alert("Disconnected ");
          console.log("navigating to home page from update page");
          //$state.go('home');
        })
      }
    }
    //facebook
//twitter
    $scope.vm.myClicktwitter = function($event) {

        if($event){

          var clientId = 'FrNiS8CXRJ4VafvktnRAuhrJz';
          var clientSecret = 'Lm80ic9HQdkhfSIu94eL3wP5OAWYP1G9rJjDLNvO05rg5rmsRZ';
          console.log("inside twitter");
          $scope.tweet = {};

          $scope.tweet = {};

          var myToken='';
          var id = localStorage.getItem("id_user");

          $ionicPlatform.ready(function() {
            //myToken = JSON.parse(window.localStorage.getItem(twitterKey));
            if (myToken === '' || myToken === null) {
              $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
                alert(succ);
                myToken = succ;

                $scope.storeAccessToken(myToken);
                console.log("inside twitter 1");
                // window.localStorage.setItem(twitterKey, JSON.stringify(succ));
              //  $twitterApi.configure(clientId, clientSecret, myToken);
               // $scope.storeAccessToken(myToken);

              }, function(error) {
                console.log(error);
              });
            } else {
             // $twitterApi.configure(clientId, clientSecret, myToken);
             // $scope.showHomeTimeline();
            }
          });

          $scope.storeAccessToken = function(twittertoken) {
            //inside.putMethod();
            var id = localStorage.getItem("id_user");
            var  username=localStorage.getItem("username");
            var password=localStorage.getItem("password");
            var email=localStorage.getItem("email");
            var lntoken=  localStorage.getItem("lnAccessToken");
            var instagramkey =localStorage.getItem("instagramAccessToken");
            var fbkey =localStorage.getItem("fbtoken");
            var question=localStorage.getItem("question");
            var answer=localStorage.getItem("answer");
            var frequency= localStorage.getItem("frequency");

            localStorage.setItem("twitterAccessToken",JSON.stringify(twittertoken));
            //console.log("inside update function");
            $http({
              method: 'PUT',
              url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
              data: JSON.stringify({
                username: username,
                password: password,
                email: email,
                twitterAccessToken:twittertoken,
                lnAccessToken:lntoken,
                instagramAccessToken:instagramkey,
                fbtoken:fbkey,
                question:question,
                answer:answer,
                frequency:frequency
              }),

              contentType: "application/json"


            }).success(function() {
             // $scope.username = "";
              //$scope.password = "";
              //$scope.email = "";
              //$scope.twitterAccessToken = "";
              alert("Added successful");
              console.log("navigating to home page from update page");
              //$state.go('home');
            })
          };

        }
      else{

          var  username=localStorage.getItem("username");
          var password=localStorage.getItem("password");
          var email=localStorage.getItem("email");
          var id = localStorage.getItem("id_user");
          var lntoken=  localStorage.getItem("lnAccessToken");
          var instagramkey =localStorage.getItem("instagramAccessToken");
          var fbkey =localStorage.getItem("fbtoken");
          var question=localStorage.getItem("question");
          var answer=localStorage.getItem("answer");
          var frequency= localStorage.getItem("frequency");
          localStorage.setItem("twitterAccessToken",JSON.stringify(''));
          //console.log("inside update function");
          $http({
            method: 'PUT',
            url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
            data: JSON.stringify({
              username: username,
              password: password,
              email: email,
              lnAccessToken:lntoken,
              instagramAccessToken:instagramkey,
              twitterAccessToken:'',
              fbtoken:fbkey,
              question:question,
              answer:answer,
              frequency:frequency
            }),

            contentType: "application/json"


          }).success(function() {
            //$scope.username = "";
            //$scope.password = "";
            //$scope.email = "";
            // $scope.lnAccessToken = "";
            alert("Disconnected ");
            console.log("navigating to home page from update page");
            //$state.go('home');
          })

        }
    }

//end of twitter


    //instagram
    $scope.vm.myClickinsta = function($event) {


    }
    //linkedin
    $scope.vm.myClick = function($event) {
      //alert($event);
      if($event){
       // $state.go('twitter');


       /* var ref = window.open('http://apache.org', '_blank', 'location=yes');
        ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
        ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
        ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
        ref.addEventListener('exit', function(event) { alert(event.type); });
*/

        var browserRef =$window.open('http://twitterrestapi1.mybluemix.net/linkedin', '_blank', 'location=no','clearsessioncache=yes','clearcache=yes');
       browserRef.addEventListener('loadstop', function(event) {
         browserRef.executeScript(
           { code: "document.getElementById('myP').innerHTML" },
           function( values ) {
              ln_accesstoken=values[ 0 ] ;


             $scope.store_lnAccessToken(ln_accesstoken);
             browserRef.close();
           }
         );
      });

        //store access token

        $scope.store_lnAccessToken = function(lntoken) {
          //inside.putMethod();
          var  username=localStorage.getItem("username");
          var password=localStorage.getItem("password");
          var email=localStorage.getItem("email");
          var id = localStorage.getItem("id_user");
          var twitterAccesskey= JSON.parse($window.localStorage.getItem("twitterAccessToken"));
          var instagramkey =localStorage.getItem("instagramAccessToken");
          var fbkey =localStorage.getItem("fbtoken");
          var question=localStorage.getItem("question");
          var answer=localStorage.getItem("answer");
          var frequency= localStorage.getItem("frequency");

          localStorage.setItem("lnAccessToken",lntoken);
          //console.log("inside update function");
          $http({
            method: 'PUT',
            url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
            data: JSON.stringify({
              username: username,
              password: password,
              email: email,
              lnAccessToken:lntoken,
              twitterAccessToken:twitterAccesskey,
              instagramAccessToken:instagramkey,
              fbtoken:fbkey,
              question:question,
              answer:answer,
              frequency:frequency
            }),

            contentType: "application/json"


          }).success(function() {
            //$scope.username = "";
            //$scope.password = "";
            //$scope.email = "";
           // $scope.lnAccessToken = "";
            alert("update successful");
            console.log("navigating to home page from update page");
            //$state.go('home');
          })
        }



      /* var url = 'http://twitterrestapi1.mybluemix.net/linkedin';
        var authUrl = "https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=77qpmjv0fpfsmq&scope=r_basicprofile"
          + "&state=DCEeFWf45A53sdfKef424&redirect_uri=http://twitterrestapi1.mybluemix.net/linkedinresponse";

        var xhr = createCORSRequest('GET', authUrl);
        xhr.send();
        alert(xhr.responseText);
*/

      }
      else
      {
        var  username=localStorage.getItem("username");
        var password=localStorage.getItem("password");
        var email=localStorage.getItem("email");
        var id = localStorage.getItem("id_user");
        var twitterAccesskey=  JSON.parse($window.localStorage.getItem("twitterAccessToken"));
        var instagramkey =localStorage.getItem("instagramAccessToken");
        localStorage.setItem("lnAccessToken",'');
        var fbkey =localStorage.getItem("fbtoken");
        var question=localStorage.getItem("question");
        var answer=localStorage.getItem("answer");
        var frequency= localStorage.getItem("frequency");
        //console.log("inside update function");
        $http({
          method: 'PUT',
          url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
          data: JSON.stringify({
            username: username,
            password: password,
            email: email,
            "lnAccessToken":'',
            instagramAccessToken:instagramkey,
            twitterAccessToken:twitterAccesskey,
            fbtoken:fbkey,question:question,
            answer:answer,
            frequency:frequency
          }),

          contentType: "application/json"


        }).success(function() {
          //$scope.username = "";
          //$scope.password = "";
          //$scope.email = "";
          // $scope.lnAccessToken = "";
          alert("Disconnected ");
          console.log("navigating to home page from update page");
          //$state.go('home');
        })


      }

    }

    $scope.get_ln_details = function() {
      console.log("inside ln details");
      alert(ln_accesstoken);

      $http({
        method: 'GET',
        url : 'https://api.linkedin.com/v1/people/~?format=json&oauth2_access_token='+ln_accesstoken

      }).success(function(data) {
        var obj=angular.fromJson(data);

       alert(obj.firstName);
      })
    }


    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // CORS not supported.
        xhr = null;
      }
      return xhr;
    }

// Helper method to parse the title tag from the response.
    function getTitle(text) {
      return text.match('<title>(.*)?</title>')[1];
    }

// Make the actual CORS request.
    function makeCorsRequest() {
      // All HTML5 Rocks properties support CORS.
      var url = 'http://twitterrestapi1.mybluemix.net/linkedin';

      var xhr = createCORSRequest('GET', url);
      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      // Response handlers.
      xhr.onload = function() {
        var text = xhr.responseText;
        var title = getTitle(text);
        alert('Response from CORS request to ' + url + ': ' + title);
      };

      xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
      };

      xhr.send();
    }



  })

  //end of accounts

// FB ctrl
  .controller('fb', function($scope, $state,$cordovaOauth,$http,$window) {
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }
    $scope.data = {};
    var myfbtoken;
    var id=localStorage.getItem("id_user");
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function(response) {
      myfbtoken= response.fbtoken;
      // alert(response.lnAccessToken);
      $scope.displayData(myfbtoken);

    })
    $scope.displayData= function( access_token)
    {
      $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: access_token, fields: "name,gender,location,picture", format: "json" }}).then(function(result) {
        var name = result.data.name;
        var gender = result.data.gender;
        var location = result.data.location;
        var picture = result.data.picture;
        $scope.name=name;
        $scope.picture=picture.data.url;
        $scope.gender=gender;
        $scope.location=location;
        var html = '<table id="table" data-role="table" data-mode="column" class="ui-responsive"><thead><tr><th>Field</th><th>Info</th></tr></thead><tbody>';
        html = html + "<tr><td>" + "Name" + "</td><td>" + name + "</td></tr>";
        html = html + "<tr><td>" + "Gender" + "</td><td>" + gender + "</td></tr>";
        html = html + "<tr><td>" + "Picture" + "</td><td><img src='" + picture.data.url + "' /></td></tr>";
        html = html + "</tbody></table>";

        document.getElementById("listTable").innerHTML = html;
        $.mobile.changePage($("#profile"), "slide", true, true);
      }, function(error) {
        alert("There was a problem in getting your profile.  Check the logs for details.");
        console.log(error);
      });
    }
    $scope.pageClass = 'FLike';
    $scope.FLike= (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  })

  //End of Fb controller


//begin of profile controller
.controller('ProfileCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
       //$scope.pageClass = 'home';
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }
        $scope.data = {};
        $scope.pageclass = 'delete';
        $scope.delete = function() {
            var id = localStorage.getItem("id_user");
            inside.deleteMethod();
            //console.log("inside delete");
            $http({
                method: 'DELETE',
                url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

                contentType: "application/json"
            }).success(function() {
                alert("Delete success!");
                $state.go('login');
            })
        }
        $scope.pageclass = 'update';
        $scope.update = function() {
            console.log("inside update function");
            $state.go('update')
        }
         $scope.pageClass = 'logout';
    $scope.logout = function() {
        console.log("logged out!");
        $state.go('login');
    }

    })
    //end of profile controller
    //begin of update controller
    .controller("UpdateCtrl", function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
   $scope.pageClass = 'home';
    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }
        $scope.pageClass = 'update';
        $scope.update = function(username, password, email) {
            inside.putMethod();
            var id = localStorage.getItem("id_user");
            //console.log("inside update function");
            $http({
                method: 'PUT',
                url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',
                data: JSON.stringify({
                    "username": username,
                    "password": password,
                    "email": email
                }),

                contentType: "application/json"


            }).success(function() {
                $scope.username = "";
                $scope.password = "";
                $scope.email = "";
                alert("update successful");
                console.log("navigating to home page from update page");
                $state.go('home');
            })
        }
         $scope.pageClass = 'logout';
    $scope.logout = function() {
        console.log("logged out!");
        $state.go('login');
    }
    })
    //end of update controller
//begin of twitter
//

//
  .controller('MyCtrl', function($scope, $state,$cordovaOauth,$ionicPlatform,$twitterApi,$http,$window, $httpParamSerializerJQLike) {

    $scope.pageClass = 'home';
    $scope.home = function() {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function() {
      console.log("logged out!");
      $state.go('login');
    }

    //var twitterKey = 'STORAGE.TWITTER.KEY';
    var clientId = 'FrNiS8CXRJ4VafvktnRAuhrJz';
    var clientSecret = 'Lm80ic9HQdkhfSIu94eL3wP5OAWYP1G9rJjDLNvO05rg5rmsRZ';
    //var myToken = '';
    console.log("inside twitter");
    $scope.tweet = {};

    var myToken='';
    var id = localStorage.getItem("id_user");
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function(response) {
      myToken= response.twitterAccessToken;
      console.log(myToken);
     // alert(response.twitterAccessToken);
      $twitterApi.configure(clientId, clientSecret, myToken);
      $scope.showHomeTimeline();
    });





    // Load your home timeline
    $scope.showHomeTimeline = function() {
      // $twitterApi.getUserDetails();
      $twitterApi.getHomeTimeline().then(function(data) {
        $scope.home_timeline = data;
      });
    };
    // Post a tweet
    $scope.submitTweet = function() {
      $twitterApi.postStatusUpdate($scope.tweet.message).then(function(result) {
        $scope.showHomeTimeline();
      });
    };

    // Pull-to-refresh
    $scope.doRefresh = function() {
      $scope.showHomeTimeline();
      $scope.$broadcast('scroll.refreshComplete');
    };

    // Display the correct date from Twitter response
    $scope.correctTimestring = function(string) {
      return new Date(Date.parse(string));
    };
  })
//
  .controller('twitterCtrl', function($scope, $state,$cordovaOauth,$ionicPlatform,$twitterApi,$http,$window, $httpParamSerializerJQLike) {

    $scope.pageClass = 'home';
    $scope.home = function () {
      console.log("home page !");
      $state.go('home');
    }

    $scope.pageClass = 'logout';
    $scope.logout = function () {
      console.log("logged out!");
      $state.go('login');
    }

    var myToken='';
    var id = localStorage.getItem("id_user");
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project/' + id + '?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function(response) {
      myToken= response.twitterAccessToken;
     // alert(response.twitterAccessToken);

      //var twitterKey = 'STORAGE.TWITTER.KEY';
      var clientId = 'FrNiS8CXRJ4VafvktnRAuhrJz';
      var clientSecret = 'Lm80ic9HQdkhfSIu94eL3wP5OAWYP1G9rJjDLNvO05rg5rmsRZ';
      //var myToken = JSON.parse(window.localStorage.getItem(twitterKey));


      $twitterApi.configure(clientId, clientSecret, myToken);
     // alert("hbbbbh");
      $twitterApi.getUserTimeline().then(function (data) {
        //alert(data[0].id);
        $scope.user_details = data;

      });
    });

  })

//end of twitter controller



//end of twitter
//frequency
  .controller('frequentCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
    $scope.home = function() {
      console.log("home page !");
      $state.go('home');
    }
    $scope.logout = function() {
      console.log("home page !");
      $state.go('login');
    }
    $http({
      method: 'GET',
      url: 'https://api.mongolab.com/api/1/databases/studentcorner/collections//Ase_project?apiKey=Q_u73BV4oOdMGpnu3WFGmJ8YH_lxHDHO',

      contentType: "application/json"
    }).success(function (response) {
      var list = response;
      var dict = []; // create an empty array
      for (var i = 0; i < list.length; i++) {


        dict.push({
          key: list[i].username,
          value:list[i].frequency
        });
      }
      var sorted = dict.slice(0).sort(function(a, b) {
        return a.value - b.value;
      });

      var keys = [];
      for (var i = 0, len = sorted.length; i < len; ++i) {
        keys[i] = sorted[i].key;
      }
      alert(keys[i]);
    })

    })

//

;
