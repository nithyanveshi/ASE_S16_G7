angular.module('starter.controllers', ['starter.services'])
.controller('AppCtrl', function($scope, $ionicModal, $http, $timeout, $state) {

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
  $scope.logout = function() {
    localStorage.setItem("token", "");
    $state.go('login');
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
.controller('ProfileCtrl',function($scope,$state,$http,$window,$httpParamSerializerJQLike, $timeout)
			{
	
	
}	   
		 )
  .controller('LoginCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike, $timeout, API, $rootScope) {

    $scope.loginData = {};
      var token = "xxx";

    $scope.doLogin = function(sso, password) {
      console.log('Doing login', $scope.loginData);

        //var result = API.login({
        //    SSO: sso,
        //    Password: password
        //});
        //if(result == null)
        //{
        //    console.log("Invalid Credentials");
        //}
        //else {
        //    console.log("Valid Credentials");
        // //   console.log(data.toString());
        //}
        //console.log("Var: " + result.toString());
        API.login({
            SSO: sso,
            Password: password
        }).success(function (data) {
            if(data != null) {
                console.log("Valid credentials from controller");
                $rootScope.setToken(data.SSO); // create a session kind of thing on the client side

                localStorage.setItem("token", data.SSO);
                //localStorage.getItem("token");
                console.log("Data SSO: " + data.SSO);
                $rootScope.hide();
                document.getElementById('x').innerHTML = "";
                $state.go('app.home');
            }
          else {
                console.log("Invalid Credentials");
                $rootScope.hide();
                $rootScope.notify("Invalid Username or password");
                $state.go('login');
                document.getElementById('x').innerHTML = "<p><h3>Invalid Credentials! Please try again....</h3></p>";
            }

        }).error(function (error) {
          console.log("Invalid Credentials");
          $rootScope.hide();
          $rootScope.notify("Invalid Username or password");
            $state.go('login');
            document.getElementById('x').innerHTML = "<p><h5><strong>Invalid Credentials! Please try again later....</strong></h5></p>";
        });
      // $scope.data = {};
     // var count=0;
     // var remcount=3;
     // var flag=1;
     // $scope.pageClass = 'home';
     // $scope.home = function() {
     //   console.log("home page !");
     //   $state.go('home');
     // }
     // $scope.pageClass = 'login';
     //// $scope.login = function(username, password) {
     //   //console.log("inside login function");
     //   //inside.getMethod();
     //   $http({
     //     method: 'GET',
     //     url: 'https://api.mongolab.com/api/1/databases/studentcompaniondb/collections/Login?apiKey=PPjxva2p9SH3NomyxSQ6rdwiofOu1q2L',
     //     contentType: "application/json"
     //   }).success(function (response) {
     //     var list = response;
     //
     //     for (var i = 0; i < list.length; i++) {
     //       if (angular.equals(list[i].SSO, sso) && angular.equals(list[i].Password, password)) {
     //
     //         localStorage.setItem("username", list[i].SSO);
     //         localStorage.setItem("password", list[i].Password);
     //         console.log("inside if loop");
     //         flag = 0;
     //         $state.go('app.home');
     //
     //       } else {
     //         //alert("Incorrect username/password");
     //         console.log("inside else loop");
     //         count++;
     //       }
     //     }
     //
     //     if (count == list.length) {
     //       // alert("hiii");
     //       /*  remcount--;
     //        alert("Attempts remaining  "+remcount);
     //        if(remcount==0){
     //        alert("Please try again");
     //        $window.close();
     //
     //        ionic.Platform.exitApp();
     //        }*/

          }
        })

    //  }
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      //$timeout(function() {
      //  $state.go('app.search');
      //}, 1000);
    //};

    //})
    .controller('LibraryCtrl', function($scope, $state, $rootScope, $stateParams, API) {

        var SSO = localStorage.getItem("token");
        console.log("SSO from LibraryCtrl: " + SSO);
        API.getLibraryDetails({
            SSO: SSO
        }).success(function (data) {
            if(data != null) {
                console.log("Valid Lib details from controller");
                console.log("Data Library Name: " + data.LibraryName);
                $scope.libDetails = data;
                $rootScope.hide();

            }
            else {
                console.log("LibraryCtrl: Error Occured");
                $rootScope.hide();
                $rootScope.notify("LibraryCtrl: Error Occured");
                $state.go('app.home');

            }

        }).error(function (error) {
            console.log("LibraryCtrl: Something went fishy");
            $rootScope.hide();
            $rootScope.notify("LibraryCtrl: Duh, we broke");
            $state.go('app.home');
        });
      API.getLibRoomsList({
        SSO: SSO
      }).success(function (data) {
          if(data != null) {
            console.log("LibraryCtrl: Valid Lib Rooms details");
            $scope.libRoomsDetails = data;
            $rootScope.hide();

          }
          else {
            console.log("LibraryCtrl: Error Occured");
            $rootScope.hide();
            $rootScope.notify("LibraryCtrl: Error Occured");
            $state.go('app.home');

          }

        }).error(function (error) {
        console.log("LibraryCtrl: Something went fishy for getLibRoomsList");
        $rootScope.hide();
        $rootScope.notify("LibraryCtrl: Duh, we broke");
        $state.go('app.home');
      });

      $scope.reserveRoom = function(id) {
        console.log("Reserving room with ID: " + id);

      }

      $scope.indexToShow = 0;
      $scope.items = [];
        for (var i = 0; i < 100; i++) $scope.items.push(i);

        //'item 1',
        //'item 2',
        //'item 3'
      //];

      $scope.change = function(){
        $scope.indexToShow = ($scope.indexToShow + 1) % $scope.items.length;
      };
    })
.controller('PlaylistCtrl', function($scope, $stateParams) {
});
