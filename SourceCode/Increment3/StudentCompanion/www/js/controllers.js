angular.module('starter.controllers', ['starter.services', 'ionic-datepicker'])
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

    .controller('PlaylistsCtrl', function($scope, $state) {
        var SSO = localStorage.getItem("token");
        if(SSO == null) {
            $state.go('login');
        }
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
        var SSO = localStorage.getItem("token");
        if(SSO == null) {
            $state.go('login');
        }
        $scope.welcome = "Welcome to Student Companion";
    })
.controller('SamenuCtrl', function($scope, $state, $rootScope, $stateParams, API) {

  var SSO = localStorage.getItem("token");
  console.log("SSO from SamenuCtrl: " + SSO);
  API.getShiftDetails({
    SSO: SSO
  }).success(function (data) {
      if (data != null) {
        console.log("Valid Shift details from controller");
        console.log("Data Shift Details: " + data.shiftDetails);
        $scope.shiftDetails = data;
        $rootScope.hide();

      }
      else {
        console.log("SamenuCtrl: Error Occured");
        $rootScope.hide();
        $rootScope.notify("SamenuCtrl: Error Occured");
        $state.go('app.home');

      }

    }).error(function (error) {
     console.log("SamenuCtrl: Something went fishy");
     $rootScope.hide();
     $rootScope.notify("SamenuCtrl: Duh, we broke");
     $state.go('app.home');
     });


     $scope.indexToShow = 0;
     $scope.items = [];
     for (var i = 0; i < 100; i++) $scope.items.push(i);

     //'item 1',
     //'item 2',
     //'item 3'
     //];

     $scope.change = function () {
     $scope.indexToShow = ($scope.indexToShow + 1) % $scope.items.length;
  };
  })

    .controller('LoginCtrl', function ($scope, $state, $http, $window, $httpParamSerializerJQLike, $timeout, API, $rootScope) {

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
                console.log("Invalid Credentials Error");
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

.controller('ProfileCtrl',function($scope, $state, $http, $rootScope, $stateParams, API) {
    
	var SSO = localStorage.getItem("token");
    console.log("SSO from ProfileCtrl: " + SSO);
	API.getProfileDetails({
		SSO: SSO
	}).success(function (data) {
		if(data != null) {
            
			console.log("Valid User details from controller");
			console.log("First name:" + data.FirstName);
			console.log("Last name:" + data.LastName);
            console.log("First name:" + data.DOB);
            console.log("Last name:" + data.Email);
            $scope.profileDetails = data;
			$rootScope.hide();
		}
		else 
			{
				console.log("ProfileCtrl: Error Occured");
                $rootScope.hide();
                $rootScope.notify("ProfileCtrl: Error Occured");
                $state.go('app.home');
			}
	}).error(function(error)
			{
		console.log("ProfileCtrl:Something gone wrong");
		$rootScope.hide();
            $rootScope.notify("ProfileCtrl: Duh, we broke");
            $state.go('app.home');
	});
})

.controller('RegisterCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike) {
	
	$scope.pageClass = 'login';
    $scope.login = function() {
        console.log("Login page !");
        $state.go('login');
    }
        $scope.pageClass = 'register';
        $scope.register = function(sso, password) {
          //  inside.postMethod();
            $http({
                method: 'POST',
                url: 'https://api.mongolab.com/api/1/databases/studentcompaniondb/collections/Login?apiKey=PPjxva2p9SH3NomyxSQ6rdwiofOu1q2L',
                data: JSON.stringify({
                    SSO: sso,
                    Password: password
                }),
                contentType: "application/json"
            }).success(function() {
                $scope.SSO = "";
                $scope.Password = "";
                alert("User created successfully ");
                $state.go('login');
                //$scope.msg ="User created successfully";
                //$window.location.href="index.html";
            })
        }
    })
    .controller('LibraryCtrl', function($scope, $state, $rootScope, $stateParams, API,ionicDatePicker, $filter) {

        //var SSO = localStorage.getItem("token");
        var SSO = localStorage.getItem("token");
        if(SSO == null) {
            $state.go('login');
        }
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

            $state.go('app.roomReserve');
        }
      $scope.getReservations = function() {
          console.log('Getting reservations for ', SSO);
          $state.go('app.reservedRooms');
      }
        API.getOwnReservedRoomsList({
          SSO: SSO,
          date: new Date()
        }).success(function (data) {
          if (data != undefined) {
            console.log("controllers.js: user " + SSO + " has some reserved rooms");
            $scope.ownReservedRoomsList = data;


          }
          else {
            console.log("controllers.js: Error occured while fetching the user reserved rooms list");
            $rootScope.hide();
            $rootScope.notify("controllers.js: Error occured while fetching the user reserved rooms list");
            $state.go('app.home');

          }

        }).error(function (error) {
          console.log("controllers.js: Something went fishy for getOwnReservedRoomsList");
          $rootScope.hide();
          $rootScope.notify("controllers.js: Duh, we broke in getOwnReservedRoomsList");
          $state.go('app.home');
        });


        $scope.openDatePickerOne = function (val) {
            var ipObj1 = {
                callback: function (val) {  //Mandatory
                    console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    $scope.selectedDate = $filter('date')(new Date(val), 'ddMMyyyy');
                    console.log("Date format: " + $scope.selectedDate);
                    //$scope.selectedDate1 = new Date(val);
                    if($scope.selectedDate != undefined) {
                        API.getReservedRoomsList({
                            SSO: SSO,
                            selectedDate: $scope.selectedDate
                        }).success(function (data) {
                            if(data != undefined) {
                                console.log("LibraryCtrl: Valid Lib Rooms details");
                                $scope.reservedRoomsList = data;
                                $rootScope.hide();

                            }
                            else {
                                console.log("LibraryCtrl: Error occured while fetching the reserved rooms list");
                                $rootScope.hide();
                                $rootScope.notify("LibraryCtrl: Error occured while fetching the reserved rooms list");
                                $state.go('app.home');

                            }

                        }).error(function (error) {
                            console.log("LibraryCtrl: Something went fishy for getReservedRoomsList");
                            $rootScope.hide();
                            $rootScope.notify("LibraryCtrl: Duh, we broke in getReservedRoomsList");
                            $state.go('app.home');
                        });
                    }

                },
                disabledDates: [
                    new Date(2016, 2, 16),
                    new Date(2015, 3, 16),
                    new Date(2015, 4, 16),
                    new Date(2015, 5, 16),
                    new Date('Wednesday, August 12, 2015'),
                    new Date("08-16-2016"),
                    new Date(1439676000000)
                ],
                from: new Date(),
                to: new Date(2022, 10, 30),
                inputDate: new Date(),
                mondayFirst: true,
                disableWeekdays: [0],
                closeOnSelect: true,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
            console.log("Date value is: " + $scope.selectedDate);
        };

        //}

        //$scope.currentDate = new Date();
        //$scope.minDate = new Date(2106, 3, 1);
        //$scope.maxDate = new Date(2016, 6, 31);
        //
        //$scope.datePickerCallback = function (val) {
        //    if (!val) {
        //        console.log('Date not selected');
        //    } else {
        //        console.log('Selected date is : ', val);
        //    }
        //};

        //$scope.onezoneDatepicker = {
        //    date: date, // MANDATORY
        //    mondayFirst: false,
        //    months: months,
        //    daysOfTheWeek: daysOfTheWeek,
        //    startDate: startDate,
        //    endDate: endDate,
        //    disablePastDays: false,
        //    disableSwipe: false,
        //    disableWeekend: false,
        //    disableDates: disableDates,
        //    disableDaysOfWeek: disableDaysOfWeek,
        //    showDatepicker: false,
        //    showTodayButton: true,
        //    calendarMode: false,
        //    hideCancelButton: false,
        //    hideSetButton: false,
        //    highlights: highlights,
        //    callback: function(value){
        //        // your code
        //    }
        //};

    })
    
    .controller('LabsCtrl', function($scope, $state, $rootScope, $stateParams, API) {
        var SSO = localStorage.getItem("token");
        console.log("SSO from LabsCtrl: " + SSO);
        API.getLabsList({
            SSO: SSO
        }).success(function (data) {
            if(data != null) {
                console.log("Valid Labs details from controller");
                $scope.labDetails = data;
                $rootScope.hide();

            }
            else {
                console.log("LabsCtrl: Error Occured");
                $rootScope.hide();
                $rootScope.notify("LabsCtrl: Error Occured");
                $state.go('app.home');

            }

        }).error(function (error) {
            console.log("LabsCtrl: Something went fishy");
            $rootScope.hide();
            $rootScope.notify("LabsCtrl: Duh, we broke");
            $state.go('app.home');
        });
})
    .controller('PlaylistCtrl', function($scope, $stateParams) {
        var SSO = localStorage.getItem("token");
        if(SSO == undefined) {
            $state.go('login');
        }
    });
