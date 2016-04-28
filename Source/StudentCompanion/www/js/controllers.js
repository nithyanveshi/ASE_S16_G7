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
            console.log('Doing login');

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
            console.log('Doing login');

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

                API.cacheUserProfile({
                    SSO: sso
                }).success(function (data) {
                    if(data != null) {
                        console.log("Valid credentials from controller");
                        $rootScope.setToken(data.SSO); // create a session kind of thing on the client side

                        localStorage.setItem("SSO", data.SSO);
                        localStorage.setItem("FullName", data.FirstName + " " + data.LastName);
                        localStorage.setItem("Email", data.Email);
                        localStorage.setItem("Mobile", data.Mobile);
                        console.log("First name: " + data.FirstName);
                        console.log("Last name: " + data.LastName);
                        console.log("Mobile: " + data.Mobile);
                        console.log("Email: " + data.Email);
                        console.log("controllers.js: User profile data cached");
                    }
                    else {
                        console.log("controllers.js: Unable to cache user profile");
                    }

                }).error(function (error) {
                    console.log("controllers.js: Error in cacheUserProfile: " + error);
                    $state.go('login');
                });


        }
    })

    .controller('ProfileCtrl',function($scope, $state, $http, $rootScope, $stateParams, API) {

        var SSO = localStorage.getItem("token");
        console.log("SSO from ProfileCtrl: " + SSO);
        API.getProfileDetails({
            SSO: SSO
        }).success(function (data) {
            if(data != null) {

                console.log("Valid User details from controller");
                console.log("First name: " + data.FirstName);
                console.log("Last name: " + data.LastName);
                console.log("DOB: " + data.DOB);
                console.log("Email: " + data.Email);
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
            console.log("ProfileCtrl:Something gone wrong: " + error);
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
        $scope.register = function(fname,lname,dob,email,sso,password) {
            //  inside.postMethod();
            $http({
                method: 'POST',
                url: 'https://api.mongolab.com/api/1/databases/studentcompaniondb/collections/Profile?apiKey=PPjxva2p9SH3NomyxSQ6rdwiofOu1q2L',
                data: JSON.stringify({
                    FirstName: fname,
                    LastName: lname,
                    DOB:dob,
                    Email:email
                }),
                contentType: "application/json"
            })
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
    .controller('RoomReserveCtrl', function($scope, $state, $rootScope, $stateParams, API,ionicDatePicker, $filter, $window) {
        $scope.roomNo = localStorage.getItem("roomNo");
        $scope.selectedDate = localStorage.getItem("selectedDate");
        $scope.slot = localStorage.getItem("slot");

        //var SSO = localStorage.getItem("token");
        $scope.SSO = localStorage.getItem("SSO");
        $scope.FullName = localStorage.getItem("FullName");
        $scope.Email = localStorage.getItem("Email");
        $scope.Mobile = localStorage.getItem("Mobile");
        console.log("controllers.js: confirmRoomReserve: SSO: " + $scope.SSO);
        console.log("controllers.js: confirmRoomReserve: FullName: " + $scope.FullName);
        console.log("controllers.js: confirmRoomReserve: Eamil: " + $scope.Email);
        console.log("controllers.js: confirmRoomReserve: Mobile: " + $scope.Mobile);
        $scope.resStHr = $scope.slot.split(" - ")[0];
        $scope.resEnHr = $scope.slot.split(" - ")[1];
        console.log("Start Hr: " + $scope.resStHr + "End Hr: " + $scope.resEnHr);
        $scope.resStartTime = $scope.selectedDate + " " + $scope.resStHr;
        $scope.resEndTime = $scope.selectedDate + " " + $scope.resEnHr;
        console.log("StartTime: " + $scope.resStartTime + "EndTime: " + $scope.resEndTime);
        console.log("controllers.js: Reserving room with details: " + "Room No.: " + $scope.roomNo + "Date: " + $scope.selectedDate +
            "Slot: " + $scope.slot + "User: " + $scope.SSO);

        $scope.finalReserveRoom = function(FullName, Email, Mobile) {
                API.newRoomReservation({
                Login_ID: $scope.SSO,
                Room_ID: $scope.roomNo,
                StartTime: $scope.resStartTime,
                EndTime: $scope.resEndTime,
                Status: "Active",
                ReservedFor: FullName,
                Email: Email,
                Mobile: Mobile
            }).success(function (data) {
                if (data) {
                    console.log("controllers.js:New Room Reservation: " + JSON.stringify(data));
                    $scope.libRoomsList = data;
                    $state.go('app.reservedRooms');
                }
                else {
                    console.log("controllers.js: Error occured while reserving the room");
                    $rootScope.hide();
                    $rootScope.notify("controllers.js: Error occured while reserving the room");
                    $state.go('app.home');

                }

            }).error(function (error) {
                console.log("controllers.js: Something went fishy for newRoomReservation");
                $rootScope.hide();
                $rootScope.notify("controllers.js: Duh, we broke in newRoomReservation");
                $state.go('app.home');
            });
        }
    })
    .controller('LibraryCtrl', function($scope, $state, $rootScope, $stateParams, API,ionicDatePicker, $filter, $window) {

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

        $scope.selectARoom = function() {
            $state.go('app.libRoomsList');
        }
        $scope.reserveRoom = function(roomNo){
            localStorage.setItem("roomNo", roomNo);
            $state.go('app.roomReserve');
        }
        $scope.confirmRoomReserve = function(roomNo, selectedDate, slot){
            localStorage.setItem("roomNo", roomNo);
            localStorage.setItem("selectedDate", selectedDate);
            localStorage.setItem("slot", slot);

            $state.go('app.confirmRoomReserve');
        }
            API.getLibRoomsList({
                SSO: SSO
            }).success(function (data) {
                if (data) {
                    console.log("controllers.js:Library Rooms List: " + JSON.stringify(data));
                    $scope.libRoomsList = data;

                }
                else {
                    console.log("controllers.js: Error occured while fetching the library rooms list");
                    $rootScope.hide();
                    $rootScope.notify("controllers.js: Error occured while fetching the library rooms list");
                    $state.go('app.home');

                }

            }).error(function (error) {
                console.log("controllers.js: Something went fishy for getLibRoomsList");
                $rootScope.hide();
                $rootScope.notify("controllers.js: Duh, we broke in getLibRoomsList");
                $state.go('app.home');
            });
        //}
        $scope.getReservations = function() {
            console.log('Getting reservations for ', SSO);
            $state.go('app.reservedRooms');
        }
        API.getOwnReservedRoomsList({
            SSO: SSO,
            date: new Date()
        }).success(function (data) {
            if (data) {
                console.log("controllers.js: user " + SSO + " has some reserved rooms: " + angular.fromJson(data));

                $scope.ownReservedRoomsList = [];
                $scope.list = [];
                for (var i = 0; i < data.length; i++) {
                    //if (data[i].isCompleted == false) {
                    $scope.list.push(data[i]);
                    //}
                }
                for(var i =0; i< $scope.list.length; i++) {
                    $scope.list[i].Dt = $filter('date')(new Date($scope.list[i].EndTime), 'EEE MM-dd-yyyy');
                    console.log("StartTime: " + $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm'));
                    $scope.list[i].StartTime = $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm');
                    console.log("EndtTime: " + $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm'));
                    $scope.list[i].EndTime = $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm');

                    //console.log("StartTime: " + new Date($scope.list[i].StartTime));
                    console.log("Record " + i + ": [ " + $scope.list[i]._id + ", " + $scope.list[i].StartTime + ", " + $scope.list[i].EndTime + ", " + $scope.list[i].Room_ID + " ]");
                    console.log();
                }
                console.log("List is: " + $scope.list);
                $scope.ownReservedRoomsList = $scope.list;
                //$scope.ownReservedRoomsList = data;
                if($scope.list.length == 0)
                {
                    document.getElementById('nodata').innerHTML = "<p><h5><strong>You don't have any reservations</strong></h5></p>";
                }
                else {
                    document.getElementById('nodata').innerHTML = "";
                }
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

        $scope.disabledDates = [];
        API.getHolidays({
            SSO: SSO
        }).success(function (data) {
            if(data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var dt = $filter('date')(new Date(data[i].Date), 'MM-dd-yyyy');
                    $scope.disabledDates.push(dt);
                }
                for (var i=0; i < $scope.disabledDates.length; i++) {
                    console.log($scope.disabledDates[i]);
                }
            }
        });
        //Room Reservation: Logic for getting available time slots for the selected room
        $scope.openDatePickerOne = function (val) {

            var ipObj1 = {
                callback: function (val) {  //Mandatory
                    console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    $scope.selectedDate = $filter('date')(new Date(val), 'MM-dd-yyyy');
                    $scope.selectedDateInSec = val;
                    console.log("Date format: " + $scope.selectedDate);
                    console.log("Selected Date In Sec: " + $scope.selectedDateInSec);
                    $scope.roomNo = localStorage.getItem("roomNo");
                    console.log("Selected Room: " + $scope.roomNo);
                    //$scope.selectedDate1 = new Date(val);

                    if($scope.selectedDateInSec != undefined) {
                        API.getReservedRoomsList({
                            SSO: SSO,
                            selectedDate: $scope.selectedDate,
                            selectedRoomNo: $scope.roomNo
                        }).success(function (data) {
                            if(data != undefined) {
                                $scope.reservedRoomsList = [];
                                $scope.hrs = {"00:00 - 01:00": 0, "01:00 - 02:00": 0, "02:00 - 03:00": 0, "03:00 - 04:00": 0,
                                    "04:00 - 05:00": 0,"05:00 - 06:00": 0, "06:00 - 07:00": 0, "07:00 - 08:00": 0, "08:00 - 09:00": 0,
                                    "09:00 - 10:00": 0, "10:00 - 11:00": 0,"11:00 - 12:00": 0, "12:00 - 13:00": 0,
                                    "13:00 - 14:00": 0, "14:00 - 15:00": 0, "15:00 - 16:00": 0, "16:00 - 17:00": 0,
                                    "17:00 - 18:00": 0, "18:00 - 19:00":0, "19:00 - 20:00": 0, "20:00 - 21:00": 0,
                                    "21:00 - 22:00": 0, "22:00 - 23:00": 0,"23:00 - 0:00": 0};

                                console.log("LibraryCtrl: Valid Lib Rooms details");
                                $scope.reservedRoomsList = [];
                                $scope.list = [];
                                for (var i = 0; i < data.length; i++) {
                                    //if (data[i].isCompleted == false) {
                                    $scope.list.push(data[i]);
                                    //}
                                }
                                $scope.concatStr = function(a, b) {
                                    var begin = a;
                                    var end = b;
                                    if(a<10) {
                                        begin = "0" + a;
                                    }
                                    if(b<10) {
                                        end = "0" + b;
                                    }
                                    return begin + ":00 - " + end + ":00";
                                }
                                for(var i =0; i< $scope.list.length; i++) {
                                    $scope.list[i].Dt = $filter('date')(new Date($scope.list[i].EndTime), 'EEE MM-dd-yyyy');
                                    $scope.startHr = $filter('date')(new Date($scope.list[i].StartTime), 'HH');
                                    $scope.endHr  = $filter('date')(new Date($scope.list[i].EndTime), 'HH');
                                    console.log("StartTime: " + $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm'));
                                    $scope.list[i].StartTime = $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm');
                                    console.log("EndtTime: " + $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm'));
                                    $scope.list[i].EndTime = $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm');
                                    $scope.stHr = parseInt($scope.startHr);
                                    $scope.enHr = parseInt($scope.endHr);

                                    var beginHr = $scope.stHr;
                                    for(var j=$scope.stHr; j<$scope.enHr; j++) {

                                        var nextHr = 0;
                                        if($scope.startHr == 23) {
                                            nextHr = "0";
                                        }
                                        else {
                                             nextHr = j + 1;
                                        }
                                        //var slotID = "slot" + $scope.concatStr(beginHr, nextHr);
                                        var slotID = $scope.concatStr(beginHr, nextHr);
                                        console.log("Slot ID: " + slotID);
                                        beginHr = nextHr;
                                        $scope.hrs[slotID] = 1;
                                    }

                                    //for(var k=0;k<=$scope.hrs.length;k++) {
                                    //
                                    //}
                                    console.log("FinalSlot: " + JSON.stringify($scope.hrs));
                                    //$scope.hrs[slotID] =



                                    //console.log("StartTime: " + new Date($scope.list[i].StartTime));
                                    console.log("Record " + i + ": [ " + $scope.list[i]._id + ", " + $scope.list[i].StartTime + ", " + $scope.list[i].EndTime + ", " + $scope.list[i].Room_ID + " ]");
                                }
                                $scope.availableHrs = [];

                                for(var hr in $scope.hrs) {
                                    if($scope.hrs.hasOwnProperty(hr)) {
                                        if($scope.hrs[hr] == 0) {
                                            $scope.availableHrs.push(hr);
                                        }
                                    }
                                }
                                console.log("cocntrollers.js: Available hours: ");
                                for(var p=0; p<$scope.availableHrs.length; p++)
                                {
                                    console.log($scope.availableHrs[p]);
                                }
                                console.log("List is: " + $scope.list);
                                $scope.reservedRoomsList = $scope.list;
                                //$scope.ownReservedRoomsList = data;
                                if($scope.list.length == 0)
                                {
                                    document.getElementById('nodata').innerHTML = "<p><h5><strong>No reservations were made on this day!!!</strong></h5></p>";
                                }
                                else {
                                    document.getElementById('nodata').innerHTML = "";
                                }

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
                disabledDates: $scope.disabledDates,
                from: $filter('date')(new Date(), 'yyyy-MM-dd'),
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
        $scope.cancelReservation = function(reservationID) {
            //console.log("Cancelled");
            API.cancelReservation({
                SSO: SSO,
                reservationID: reservationID,
                date: new Date()
            }).success(function (data) {
                if (data != undefined) {
                    console.log("controllers.js: user " + SSO + " cancelled the room reservation with ID: " + reservationID + ", Status: " + data);
                    $scope.cancelReservationResult = data;
                    $window.location.reload(true);


                }
                else {
                    console.log("controllers.js: Error occured cancelling the room reservation");
                    //$rootScope.hide();
                    //$rootScope.notify("controllers.js: Error occured while fetching the user reserved rooms list");
                    $state.go('app.home');

                }

            }).error(function (error) {
                console.log("controllers.js: Something went fishy for cancelReservation");
                $rootScope.hide();
                $rootScope.notify("controllers.js: Duh, we broke in cancelReservation");
                $state.go('app.home');
            });
            $scope.doRefresh = function() {
                $window.location.reload(true);

            };
            //$cordovaToast
            //    .show('Reservation cancellation succeeded' + roomID, 'long', 'center')
            //    .then(function(success) {
            //        // success
            //    }, function (error) {
            //        // error
            //    });

        }
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
