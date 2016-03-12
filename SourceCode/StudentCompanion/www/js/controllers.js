angular.module('starter.controllers', [])

<<<<<<< HEAD
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
=======
.controller('AppCtrl', function($scope, $ionicModal, $http, $timeout, $state) {
>>>>>>> sc9v9_1

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
<<<<<<< HEAD
  $scope.login = function() {
    $scope.modal.show();
=======
  $scope.logout = function() {
    $state.go('login');
>>>>>>> sc9v9_1
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
    .controller('HomeCtrl', function($scope, $stateParams) {
    $scope.welcome = "Welcome to Student Companion";
    })
<<<<<<< HEAD
=======

  .controller('LoginCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike, $timeout) {

    $scope.loginData = {};

    $scope.doLogin = function(sso, password) {
      console.log('Doing login', $scope.loginData);

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
     // $scope.login = function(username, password) {
        //console.log("inside login function");
        //inside.getMethod();
        $http({
          method: 'GET',
          url: 'https://api.mongolab.com/api/1/databases/studentcompaniondb/collections/Login?apiKey=PPjxva2p9SH3NomyxSQ6rdwiofOu1q2L',
          contentType: "application/json"
        }).success(function (response) {
          var list = response;

          for (var i = 0; i < list.length; i++) {
            if (angular.equals(list[i].SSO, sso) && angular.equals(list[i].Password, password)) {

              localStorage.setItem("username", list[i].SSO);
              localStorage.setItem("password", list[i].Password);
              console.log("inside if loop");
              flag = 0;
              $state.go('app.home');

            } else {
              //alert("Incorrect username/password");
              console.log("inside else loop");
              count++;
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
            $state.go('login');
            document.getElementById('x').innerHTML = "<p><h3>Invalid Credentials! Please try again....</h3></p>";
          }
        })

    //  }
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      //$timeout(function() {
      //  $state.go('app.search');
      //}, 1000);
    };

    })
>>>>>>> sc9v9_1
.controller('PlaylistCtrl', function($scope, $stateParams) {
});
