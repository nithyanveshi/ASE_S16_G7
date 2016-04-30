angular.module('starter.controllers', ['starter.services', 'ionic-datepicker', 'toaster', 'ngAnimate'])
    .controller('AppCtrl', function ($scope, $ionicModal, $http, $timeout, $state, $rootScope, API, $window, $ionicHistory, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};
        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            var sso = localStorage.getItem("token");
            $scope.$root.showSAMenu = false;
            console.log("AppCtrl: sso: " + sso);
            API.cacheUserProfile({
                SSO: sso
            }).success(function (data) {
                if (data != null) {
                    console.log("Valid credentials from controller");
                    $rootScope.setToken(data.SSO); // create a session kind of thing on the client side
                    $scope.$root.showSAMenu=false;

                    localStorage.setItem("IsSA", data.IsSA);
                    console.log("IsSA: " + data.IsSA);
                    if(data.IsSA == 0) {
                        $scope.$root.showSAMenu = false;
                    }
                    else {
                        $scope.$root.showSAMenu = true;
                    }
                    console.log("controllers.js: AppCtrl: User profile data cached");
                }
                else {
                    console.log("controllers.js: AppCtrl: Unable to cache user profile");
                }
                //$state.go('app.home');

            }).error(function (error) {
                console.log("controllers.js: AppCtrl: Error in cacheUserProfile: " + error);
                $state.go('login');
            });
            //$scope.showSAMenu = "true";
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.logout = function () {
            //$timeout(function () {
            //    localStorage.clear();
            //    $ionicHistory.clearCache();
            //    $ionicHistory.clearHistory();
            //    //localStorage.setItem("token", "");
            //}, 1000);
            $timeout(function () {
                //$ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $state.go('login');
            }, 300);
            //$state.go('login');
        };

	$scope.updateprofile=function(){
    $state.go('app.editprofile');
};
    $scope.updatepassword=function(){
        $state.go('app.editpassword');
    };
    
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login');

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('PlaylistsCtrl', function ($scope, $state) {
        var SSO = localStorage.getItem("token");
        if (SSO == null) {
            $state.go('login');
        }
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })
    .controller('HomeCtrl', function ($scope, $state, $stateParams, API, $filter) {
        var SSO = localStorage.getItem("token");
        var FirstName = localStorage.getItem("FirstName");
        if (!SSO) {
            $state.go('login');
        }
        $scope.welcome = "Welcome " + FirstName;
        API.getEnrollments({
            SSO: SSO,
            month: $filter('date')(new Date(), 'MMM'),
            year: $filter('date')(new Date(), 'yyyy')
        }).success(function (data) {
            if (data != null) {
                console.log("controllers.js: Received valid Enrollment details");
                console.log("controllers.js: Enrollment Details: " + JSON.stringify(data));
                $scope.enrollments = data;
                $scope.notif = [];
                $scope.semYr = data[0].Semester + " " + data[0].Year;
                var k=0;
                var wod = $filter('date')(new Date(), 'EEE');
                for(var i=0; i<data.length; i++) {
                    var subjDay = data[i].CourseDays.split(",");
                    var isClassToday = "false";
                    console.log("CourseID: " + data[i].CourseID + ", SubjDay1: " + subjDay[0] + ", SubjDay2: " + subjDay[1]);
                    for(var j=0; j<subjDay.length; j++) {
                        if(wod == subjDay[j]) {
                            isClassToday = "true";
                            var dt = $filter('date')(new Date(), 'MM-dd-yyyy');
                            var subjStartHr = data[i].CourseHours.split("-")[0];
                            var currTime = new Date();
                            var todaySubjTime = new Date(dt + " " + subjStartHr);
                            console.log("todaySubjTime: " + todaySubjTime);
                            if(todaySubjTime < currTime) {
                                console.log("No upcoming classes");
                                $scope.noUpcomingClassMsg = "You do not have any upcoming classes today!!!";
                                continue;
                            }
                            else {
                                var timeDiff = todaySubjTime - currTime;
                                console.log("timeDiff: " + timeDiff);
                                var timeDiffInMins = timeDiff/60000;
                                console.log("timeDiffInMins: " + timeDiffInMins);
                                var timeDiffHrs = Math.ceil(timeDiffInMins/60);
                                var timeDiffMins = parseInt(timeDiffInMins%60);
                                $scope.notif[k] = "You have " + data[i].CourseID + " class by " + data[i].Professor
                                    + " in the next " + timeDiffHrs +" hours and " + timeDiffMins + " minutes"
                                k++;
                            }
                        }
                        if(isClassToday == "false") {
                            $scope.noUpcomingClassMsg = "You do not have any upcoming classes today!!!";
                        }
                    }
                }
                if($scope.notif.length !=0) {
                    for(k=0; k<$scope.notif.length; k++) {
                        console.log($scope.notif[k]);
                    }
                }


            }
            else {
                console.log("controllers.js: HomeCtrl: No enrollments were found for " + SSO);
                $state.go('app.home');

            }

        }).error(function (error) {
            console.log("controllers.js: HomeCtrl: Something went fishy during enrollments fetch");
            $state.go('app.home');
        });
        //    var mon = $filter('date')(new Date(), 'MMM');
        //    var yr = $filter('date')(new Date(), 'yyyy');

        API.getDues({
            SSO: SSO,
            month: $filter('date')(new Date(), 'MMM'),
            year: $filter('date')(new Date(), 'yyyy')
        }).success(function (data) {
            $scope.dues = [];
            for(var i=0; i<data.length; i++) {
                var dt = new Date();
                var dueDate = new Date(data[i].DueDate);
                if(dueDate>=dt) {
                    $scope.dues[i] = data[i];
                }
            }
            //if(data) {
            //    //console.log("Dues: " + JSON.stringify($scope.dues));
            //}
            //$scope.dues = data;
            console.log("controllers.js: HomeCtrl: Dues: " + JSON.stringify($scope.dues));
        }).error(function (error) {
            console.log("controllers.js: HomeCtrl: Something went fishy during Dues fetch");
            $state.go('app.home');
        });
    })

    .controller('SamenuCtrl', function($scope, $state, $rootScope, $stateParams, API,ionicDatePicker, $filter, $window) {
        //$window.location.reload(true);

        var SSO = localStorage.getItem("token");
        console.log("SSO from SamenuCtrl: " + SSO);



        $scope.indexToShow = 0;
        $scope.items = [];
        for (var i = 0; i < 100; i++) $scope.items.push(i);


        $scope.change = function () {
            $scope.indexToShow = ($scope.indexToShow + 1) % $scope.items.length;
        };
        $scope.takeShift = function (shiftID, profile_ID, date, start, end, location) {
            console.log("controllers.js: SamenuCtrl: Shift ID is: " + shiftID);
            localStorage.setItem("shiftPostedID", shiftID);
            localStorage.setItem("shiftPostedBy", profile_ID);
            localStorage.setItem("shiftPostedDate", date);
            localStorage.setItem("shiftPostedStHr", start);
            localStorage.setItem("shiftPostedEnHr", end);
            localStorage.setItem("shiftPostedLoc", location);
            $state.go('app.takeShift');
        };


        $scope.openDatePickerTwo = function (val) {

            var ipObj1 = {
                callback: function (val) {  //Mandatory
                    console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    $scope.selectedDate = $filter('date')(new Date(val), 'MM-dd-yyyy');
                    $scope.selectedDateInSec = val;
                    console.log("Date format: " + $scope.selectedDate);
                    console.log("Selected Date In Sec: " + $scope.selectedDateInSec);
                   // $scope.shiftDetails = localStorage.getItem("roomNo");
                    console.log("Selected Room: " + $scope.shiftDetails);
                    //$scope.selectedDate1 = new Date(val);

                    if($scope.selectedDateInSec != undefined) {
                        API.getShiftDetails({
                            SSO: SSO,
                            selectedDate: $scope.selectedDate,
                           // selectedRoomNo: $scope.roomNo
                        }).success(function (data) {
                            if(data != undefined) {
                                console.log("Valid Shift details from controller");
                                console.log("Data Shift Details: " + JSON.stringify(data.shiftDetails));
                                $scope.shiftDetails = data;



                            }
                            else {
                                console.log("SamenuCtrl: Error occured while fetching the  shift list");
                                $rootScope.hide();
                                $rootScope.notify("SaamenuCtrl: Error occured while fetching the shift list");
                                $state.go('app.home');

                            }

                        }).error(function (error) {
                            console.log("SamenuCtrl: Something went fishy for getShiftDetails");
                            $rootScope.hide();
                            $rootScope.notify("SamenuCtrl: Duh, we broke in getShiftDetails");
                            $state.go('app.home');
                        });
                    }
                    API.getSubDetails({
                        SSO: SSO,
                        selectedDate: $scope.selectedDate,
                        // selectedRoomNo: $scope.roomNo
                    }).success(function (data) {
                        if(data != undefined) {
                          console.log("Valid Substitutions from controller "+JSON.stringify(data));
                            //console.log("Data Substitutions " + data.subDetails);
                            $scope.subDetails = data;
                            //$rootScope.hide();
                            console.log("Valid Substitutions from controller subDetails: "+JSON.stringify($scope.subDetails));

                        }
                        else {
                            console.log("SamenuCtrl: Error occured while fetching the  substitution list");
                            $rootScope.hide();
                            $rootScope.notify("SamenuCtrl: Error occured while fetching the substitution list");
                            $state.go('app.home');

                        }

                    }).error(function (error) {
                        console.log("SamenuCtrl: Something went fishy for getSubtDetails");
                        $rootScope.hide();
                        $rootScope.notify("SamenuCtrl: Duh, we broke in getSubDetails");
                        $state.go('app.home');
                    });

                }
               /* disabledDates: $scope.disabledDates,
                from: $filter('date')(new Date(), 'yyyy-MM-dd'),
                to: new Date(2022, 10, 30),
                inputDate: new Date(),
                mondayFirst: true,
                disableWeekdays: [0],
                closeOnSelect: true,
                templateType: 'popup'*/
            };
            ionicDatePicker.openDatePicker(ipObj1);
            console.log("Date value is: " + $scope.selectedDate);
        };
    })

.controller('TakeShiftCtrl', function ($scope, $state, toaster, $rootScope, $stateParams, API, $ionicHistory, ionicDatePicker, $filter, $window) {
    $scope.shiftPostedBy = localStorage.getItem("shiftPostedBy");
    $scope.shiftPostedDate = localStorage.getItem("shiftPostedDate");
    $scope.shiftPostedStHr = localStorage.getItem("shiftPostedStHr");
    $scope.shiftPostedEnHr = localStorage.getItem("shiftPostedEnHr");
    $scope.shiftPostedLoc = localStorage.getItem("shiftPostedLoc");
    $scope.shiftPostedID = localStorage.getItem("shiftPostedID");
    $scope.SSO = localStorage.getItem("SSO");
    $scope.ownerStHrs = $scope.shiftPostedStHr;
    console.log("ShiftPostedID: " + $scope.shiftPostedID);

    $scope.startHrs = [];
    $scope.endHrs = [];
    var index=0;
    for(var i=parseInt($scope.shiftPostedStHr); i<parseInt($scope.shiftPostedEnHr); i++) {
        $scope.startHrs[index] = i;
        index++;
    }
    index = 0;
    for(var i=parseInt($scope.shiftPostedStHr)+1; i<=parseInt($scope.shiftPostedEnHr); i++) {
        $scope.endHrs[index] = i;
        index++;
    }
    for(var j=0; j<index; j++) {
        console.log("Start: " + $scope.startHrs[j] + ", End: " + $scope.endHrs[j]);
    }
    $scope.subType = "full";
    $scope.confirmTakeShift = function (stHrs, enHrs) {
        if(stHrs == parseInt($scope.shiftPostedStHr)) {
            if (enHrs == parseInt($scope.shiftPostedEnHr)) {
                console.log("Full shift has been taken");
                $scope.subType = "full";
                $scope.userStHrs = stHrs + ":00";
                $scope.userEnHrs = enHrs + ":00";
                console.log("User Shift: Start: " + $scope.userStHrs + "End: " +$scope.userEnHrs);
            }
            else if (enHrs != parseInt($scope.shiftPostedEnHr)) {
                console.log("First Half taken");
                $scope.subType = "firstHalf";
                $scope.userStHrs = stHrs + ":00";
                $scope.userEnHrs = enHrs + ":00";
                $scope.ownerStHrs = enHrs + ":00";
                $scope.ownerEnHrs = $scope.shiftPostedEnHr;
                console.log("User Shift: Start: " + $scope.userStHrs + "End: " +$scope.userEnHrs);
                console.log("Owner Shift: Start: " + $scope.ownerStHrs + "End: " +$scope.ownerEnHrs);
            }
        }
        else if(enHrs == parseInt($scope.shiftPostedEnHr)) {
            console.log("Second Half taken");
            $scope.userStHrs = stHrs + ":00";
            $scope.userEnHrs = enHrs + ":00";
            $scope.ownerStHrs = $scope.shiftPostedStHr;
            $scope.ownerEnHrs = stHrs + ":00";
            $scope.subType = "secondHalf";
            console.log("User Shift: Start: " + $scope.userStHrs + "End: " +$scope.userEnHrs);
            console.log("Owner Shift: Start: " + $scope.ownerStHrs + "End: " +$scope.ownerEnHrs);
        }
        else if(enHrs != parseInt($scope.shiftPostedEnHr)) {
            console.log("Middle half taken");
            $scope.subType = "middleHalf";
            $scope.userStHrs = stHrs + ":00";
            $scope.userEnHrs = enHrs + ":00";
            $scope.ownerStHrs1 = $scope.shiftPostedStHr;
            $scope.ownerEnHrs1 = stHrs + ":00";
            $scope.ownerStHrs2 = enHrs + ":00";
            $scope.ownerEnHrs2 = $scope.shiftPostedEnHr;
            console.log("User Shift: Start: " + $scope.userStHrs + "End: " +$scope.userEnHrs);
            console.log("Owner Shift1: Start: " + $scope.ownerStHrs1 + "End: " +$scope.ownerEnHrs1);
            console.log("Owner Shift2: Start: " + $scope.ownerStHrs2 + "End: " +$scope.ownerEnHrs2);
        }

        if($scope.subType == "full") {
            API.updateOwnerFullShift({
                SSO: $scope.SSO,
                ShiftPostedID: $scope.shiftPostedID
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner shift removal was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to remove owner shift");
                }

            }).error(function (error) {
                console.log("Error while removing owner shift");
                $state.go('app.home');
            });

            API.updateFullShift({
                SSO: $scope.SSO,
                Date: $scope.shiftPostedDate,
                Start: $scope.shiftPostedStHr,
                End: $scope.shiftPostedEnHr,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "No",
                ISTaken: "Yes"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Shift take was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to take shift");
                }

            }).error(function (error) {
                console.log("Error while substituting the shift");
                $state.go('app.home');
            });
        }
        else if($scope.subType == "secondHalf" || $scope.subType == "firstHalf") {
            API.updateOwnerFullShift({
                SSO: $scope.SSO,
                ShiftPostedID: $scope.shiftPostedID
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner shift removal was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to remove owner shift");
                }

            }).error(function (error) {
                console.log("Error while removing owner shift");
                $state.go('app.home');
            });

            API.insertHalfShift({
                SSO: $scope.shiftPostedBy,
                Date: $scope.shiftPostedDate,
                Start: $scope.ownerStHrs,
                End: $scope.ownerEnHrs,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "Yes",
                IsTaken: "No"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner shift part update was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to owner shift part");
                }

            }).error(function (error) {
                console.log("Error while updating the owner shift");
                $state.go('app.home');
            });

            //Inserting user half part of the shift
            API.insertHalfShift({
                SSO: $scope.SSO,
                Date: $scope.shiftPostedDate,
                Start:  $scope.userStHrs,
                End:  $scope.userEnHrs,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "No",
                IsTaken: "Yes"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Shift take was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to take shift");
                }

            }).error(function (error) {
                console.log("Error while substituting the shift");
                $state.go('app.home');
            });
        }
        else if($scope.subType == "middleHalf") {

            //Removing owner original shift
            API.updateOwnerFullShift({
                SSO: $scope.SSO,
                ShiftPostedID: $scope.shiftPostedID
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner shift removal was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to remove owner shift");
                }

            }).error(function (error) {
                console.log("Error while removing owner shift");
                $state.go('app.home');
            });

            //Inserting user half part of the shift
            API.insertHalfShift({
                SSO: $scope.SSO,
                Date: $scope.shiftPostedDate,
                Start:  $scope.userStHrs,
                End:  $scope.userEnHrs,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "No",
                IsTaken: "Yes"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Shift take was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to take shift");
                }

            }).error(function (error) {
                console.log("Error while substituting the shift");
                $state.go('app.home');
            });

            //Inserting owner first half part of the shift

            API.insertHalfShift({
                SSO: $scope.shiftPostedBy,
                Date: $scope.shiftPostedDate,
                Start:  $scope.ownerStHrs1,
                End:  $scope.ownerEnHrs1,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "Yes",
                IsTaken: "No"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner Shift part1 update was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to update Owner Shift part1");
                }

            }).error(function (error) {
                console.log("Error while updating Owner Shift part1");
                $state.go('app.home');
            });

            //Inserting owner second half part of the shift

            API.insertHalfShift({
                SSO: $scope.shiftPostedBy,
                Date: $scope.shiftPostedDate,
                Start:  $scope.ownerStHrs2,
                End:  $scope.ownerEnHrs2,
                Location: $scope.shiftPostedLoc,
                IsSubstitution: "Yes",
                IsTaken: "No"
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Owner Shift part2 insert was successful");
                    //$state.go('app.home');

                }
                else {
                    console.log("Unable to update Owner Shift part2");
                }

            }).error(function (error) {
                console.log("Error while updating Owner Shift part2");
                $state.go('app.home');
            });

        }
        $state.go('app.samenu');

    }


})
    .controller('LoginCtrl', function ($scope, $state, $http, $window, $httpParamSerializerJQLike, $timeout, API, $rootScope) {

        $scope.loginData = {};
        var token = "xxx";

        $scope.doLogin = function (sso, password) {
            console.log('Doing login');
            $scope.SSO = sso;


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
            $scope.validUser = "false";
            API.login({
                SSO: sso,
                Password: password
            }).success(function (data) {
                if (data != null) {
                    $scope.validUser = "true";
                    console.log("Valid credentials from controller");
                    $rootScope.setToken(data.SSO); // create a session kind of thing on the client side

                    localStorage.setItem("token", data.SSO);
                    //localStorage.getItem("token");
                    console.log("Data SSO: " + data.SSO);
                    //$rootScope.hide();
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

            console.log("controllers.js: LoginCtrl: validLogin: " + $scope.validUser);
            //if($scope.validUser == "true") {
                API.cacheUserProfile({
                    SSO: sso
                }).success(function (data) {
                    if (data != null) {
                        console.log("Valid credentials from controller");
                        $rootScope.setToken(data.SSO); // create a session kind of thing on the client side
                        $rootScope.showSAMenu="false";
                        localStorage.setItem("SSO", data.SSO);
                        localStorage.setItem("FullName", data.FirstName + " " + data.LastName);
                        localStorage.setItem("FirstName", data.FirstName);
                        localStorage.setItem("LastName", data.LastName);
			localStorage.setItem("DOB" , data.DOB);
                        localStorage.setItem("Email", data.Email);
                        localStorage.setItem("Mobile", data.Mobile);
                        localStorage.setItem("IsSA", data.IsSA);

			localStorage.setItem("MobileNo", data.MobileNo);
                        localStorage.setItem("Address1", data.Address1);
                        localStorage.setItem("Address2", data.Address2);
                        localStorage.setItem("City", data.City);
                        localStorage.setItem("State", data.State);
                        localStorage.setItem("ZipCode", data.ZipCode);
                        console.log("First name: " + data.FirstName);
                        console.log("Last name: " + data.LastName);
                        console.log("Mobile: " + data.Mobile);
                        console.log("Email: " + data.Email);
			console.log("Address1: " + data.Address1);
                        console.log("Address2: " + data.Address2);
                        console.log("City: " + data.City);
                        console.log("State: " + data.State);
                        console.log("Zip: " + data.ZipCode);
                        console.log("IsSA: " + data.IsSA);
                        if(data.IsSA == 0) {
                            $rootScope.showSAMenu = "false";
                        }
                        else {
                            $rootScope.showSAMenu = "true";
                        }
                        console.log("controllers.js: User profile data cached");
                    }
                    else {
                        console.log("controllers.js: Unable to cache user profile");
                    }
                    //$state.go('app.home');

                }).error(function (error) {
                    console.log("controllers.js: Error in cacheUserProfile: " + error);
                    $state.go('login');
                });
            //}



        }
    })

    .controller('ProfileCtrl', function ($scope, $state, $http, $rootScope, $stateParams, API) {

        var SSO = localStorage.getItem("token");
        console.log("SSO from ProfileCtrl: " + SSO);
        API.getProfileDetails({
            SSO: SSO
        }).success(function (data) {
            if (data != null) {

                console.log("Valid User details from controller");
                console.log("First name: " + data.FirstName);
                console.log("Last name: " + data.LastName);
                console.log("DOB: " + data.DOB);
                console.log("Email: " + data.Email);
                $scope.profileDetails = data;
                $rootScope.hide();
            }
            else {
                console.log("ProfileCtrl: Error Occured");
                $rootScope.hide();
                $rootScope.notify("ProfileCtrl: Error Occured");
                $state.go('app.home');
            }
        }).error(function (error) {
            console.log("ProfileCtrl:Something gone wrong: " + error);
            $rootScope.hide();
            $rootScope.notify("ProfileCtrl: Duh, we broke");
            $state.go('app.home');
        });
    })
.controller('PwdEditCtrl',function($scope, $state, $http, $window, $rootScope,API,$httpParamSerializerJQLike) {
    
     var SSO = localStorage.getItem("token");
     console.log("SSO from PwdEditCtrl: " + SSO);
    $scope.updatepassword = function(password){
        console.log('Updating user password'); 
        API.editUserPassword({
            SSO:SSO,
            Password:password
        }).success(function(data) {
            if(data != null) {
                console.log("Valid credentials from controller");
                alert("Password changed successfully!");
                $state.go('login');
                $rootScope.setToken(data.SSO);
                localStorage.setItem("Password",password);
        }
            else {
                console.log("Controllers.js:Unable to edit user password");
            }
        }).error(function(error){
            console.log("controllers.js: Error in controller: " + error);
             $state.go('app.profile');
        });
    }
})
.controller('ProfEditCtrl', function($scope, $state, $http, $window, $rootScope,API,$httpParamSerializerJQLike) {
    var SSO = localStorage.getItem("token");
        console.log("SSO from ProfEditCtrl: " + SSO);
    
    $scope.Email= localStorage.getItem("Email");
    
    console.log("Email from ProfEditCtrl " + $scope.Email);
    
    $scope.FirstName= localStorage.getItem("FirstName");
    $scope.LastName= localStorage.getItem("LastName");
    $scope.DOB= localStorage.getItem("DOB");
    $scope.MobileNo= localStorage.getItem("MobileNo");
    $scope.Email= localStorage.getItem("Email");
    $scope.Address1= localStorage.getItem("Address1");
    $scope.Address2= localStorage.getItem("Address2");
    $scope.City= localStorage.getItem("City");
    $scope.State= localStorage.getItem("State");
    $scope.ZipCode= localStorage.getItem("ZipCode");
    
        $scope.update = function(MobileNo,Address1,Address2,City,State,ZipCode) {
            console.log('Updating user profile');  
            API.editUserProfile({  
                MobileNo:MobileNo,
                Address1:Address1,
                Address2:Address2,
                City:City,
                State:State,
                ZipCode:ZipCode,
                SSO: SSO 
            }).success(function (data) {
                if(data != null) {
                    console.log("Valid credentials from controller");
                       // $rootScope.setToken(data.SSO); 
                    console.log("SSO inside ProfEditCtrl" + SSO);
                    // create a session kind of thing on the client side
                    alert("Profile updated successfully!");
                $state.go('app.home');
                $rootScope.setToken(data.SSO);
                     //  localStorage.setItem("FirstName", FirstName);
                   // localStorage.setItem("LastName", LastName);
                   // localStorage.setItem("DOB", DOB);
                   // localStorage.setItem("Email", Email);
                    localStorage.setItem("MobileNo", MobileNo);
                    localStorage.setItem("Address1", Address1);
                    localStorage.setItem("Address2", Address2);
                    localStorage.setItem("City", City);
                    localStorage.setItem("State", State);
                    localStorage.setItem("ZipCode", ZipCode);
                       // localStorage.setItem("FullName", data.FirstName + " " + data.LastName);
                       // localStorage.setItem("FirstName",fname);
                      //  localStorage.setItem("Password", data.password);
                    }
                    else {
                        console.log("controllers.js: Unable to edit user profile");
                    }

                }).error(function (error) {
                    console.log("controllers.js: Error in controller: " + error);
                    $state.go('app.profile');
            });
        }
})
    .controller('RegisterCtrl', function($scope, $state, $http, $window, API,$httpParamSerializerJQLike,$ionicPopup) {
    
$scope.pageClass = 'login';
        $scope.login = function() {
            console.log("Login page !");
            $state.go('login');
        }
        $scope.pageClass = 'register';
//$scope.dob = $filter('date')(new Date(input), 'MM-dd-yyyy');
        $scope.register = function(FirstName,LastName,DOB,Email,SSO,Password,MobileNo,Address1,Address2,City,State,ZipCode) {
            console.log('Registering user profile');  
            API.registerUser({  
               FirstName:FirstName,
               LastName:LastName,
               DOB:DOB,
                SSO:SSO,
               Email:Email,
                MobileNo:MobileNo,
                Address1:Address1,
                Address2:Address2,
                City:City,
                State:State,
                ZipCode:ZipCode,
                Password: Password
            }).success(function (data) {
                if(data != null) {
                    console.log("Inside RegisterCtrl");
                    var showingText = "User created successfully";
                      var alert = $ionicPopup.alert({
                            title: 'Alert',
                template: showingText
                        })
                   // alert("User created successfully!");
                $state.go('login');
                //$rootScope.setToken(data.SSO);
                    localStorage.setItem("SSO",SSO);
                     localStorage.setItem("FirstName", FirstName);
                    localStorage.setItem("LastName", LastName);
                    localStorage.setItem("DOB", DOB);
                    localStorage.setItem("Email", Email);
                    localStorage.setItem("MobileNo", MobileNo);
                    localStorage.setItem("Address1", Address1);
                    localStorage.setItem("Address2", Address2);
                    localStorage.setItem("City", City);
                    localStorage.setItem("State", State);
                    localStorage.setItem("ZipCode", ZipCode);
                 //  localStorage.setItem("SSO",sso);
                    localStorage.setItem("Password",Password);
                       // localStorage.setItem("FullName", data.FirstName + " " + data.LastName);
                       // localStorage.setItem("FirstName",fname);
                      //  localStorage.setItem("Password", data.password);
                    }
                    else {
                        console.log("controllers.js: Unable to create user profile");
                    }

                }).error(function (error) {
                    console.log("controllers.js: Error in controller: " + error);
                    $state.go('login');
            });
        }
    })
    .controller('RoomReserveCtrl', function ($scope, $state, toaster, $rootScope, $stateParams, API, $ionicHistory, ionicDatePicker, $filter, $window) {
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

        $scope.finalReserveRoom = function (FullName, Email, Mobile) {
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
                    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                    $state.go('app.reservedRooms');
                    toaster.pop('success', "Success", "Reservation successful");
                }
                else {
                    console.log("controllers.js: Error occured while reserving the room");
                    toaster.pop('danger', "Failed", "Reservation failed");
                    $rootScope.hide();
                    $rootScope.notify("controllers.js: Error occured while reserving the room");
                    $state.go('app.home');

                }

            }).error(function (error) {
                console.log("controllers.js: Something went fishy for newRoomReservation");
                toaster.pop('danger', "Failed", "Reservation failed");
                $rootScope.hide();
                $rootScope.notify("controllers.js: Duh, we broke in newRoomReservation");
                $state.go('app.home');
            });
        }
    })
    .controller('LibraryCtrl', function ($scope, toaster, $state, $rootScope, $stateParams, API, ionicDatePicker, $filter, $window, $ionicPopup) {

        //$scope.showToast = function(message, duration, location) {
        //toaster.pop('success', "title", "text");

        //}
        //var SSO = localStorage.getItem("token");
        var SSO = localStorage.getItem("token");
        if (SSO == null) {
            $state.go('login');
        }
        console.log("SSO from LibraryCtrl: " + SSO);
        API.getLibraryDetails({
            SSO: SSO
        }).success(function (data) {
            if (data != null) {
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
            if (data != null) {
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

        $scope.selectARoom = function () {
            $state.go('app.libRoomsList');
        }
        $scope.reserveRoom = function (roomNo) {
            localStorage.setItem("roomNo", roomNo);
            $state.go('app.roomReserve');
        }
        $scope.confirmRoomReserve = function (roomNo, selectedDate, slot) {
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
        $scope.getReservations = function () {
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
                var today = new Date();
                //Getting future reservations only
                for (var i = 0; i < data.length; i++) {
                    //if (data[i].isCompleted == false) {

                    var resDate = new Date(data[i].StartTime);
                    if(resDate >= today) {
                        $scope.list.push(data[i]);
                    }
                    //}
                }
                //Sorting the reservations by date
                $scope.sortedList = $filter('orderBy')($scope.list, 'StartTime');
                $scope.list = $scope.sortedList;
                console.log("controllers.js: Sorted reservation list: " + JSON.stringify($scope.sortedList));
                for (var i = 0; i < $scope.list.length; i++) {
                    $scope.list[i].Dt = $filter('date')(new Date($scope.list[i].EndTime), 'EEE MM-dd-yy');
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
                if ($scope.list.length == 0) {
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
            console.log("controllers.js: Something went fishy for getOwnReservedRoomsList" + error);
            $rootScope.hide();
            $rootScope.notify("controllers.js: Duh, we broke in getOwnReservedRoomsList");
            $state.go('app.home');
        });

        $scope.disabledDates = [];
        API.getHolidays({
            SSO: SSO
        }).success(function (data) {
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var dt = $filter('date')(new Date(data[i].Date), 'MM-dd-yyyy');
                    $scope.disabledDates.push(dt);
                }
                for (var i = 0; i < $scope.disabledDates.length; i++) {
                    console.log($scope.disabledDates[i]);
                }
            }
        });
        // To get the whole hour. Eg: if 7:30AM is library open hour, we get 8:00AM for reservation
        $scope.roundMinutes = function (date) {
            date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
            date.setMinutes(0);

            return date;
        }
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

                    if ($scope.selectedDateInSec != undefined) {

                        $scope.hrs = {
                            "00:00 - 01:00": 0,
                            "01:00 - 02:00": 0,
                            "02:00 - 03:00": 0,
                            "03:00 - 04:00": 0,
                            "04:00 - 05:00": 0,
                            "05:00 - 06:00": 0,
                            "06:00 - 07:00": 0,
                            "07:00 - 08:00": 0,
                            "08:00 - 09:00": 0,
                            "09:00 - 10:00": 0,
                            "10:00 - 11:00": 0,
                            "11:00 - 12:00": 0,
                            "12:00 - 13:00": 0,
                            "13:00 - 14:00": 0,
                            "14:00 - 15:00": 0,
                            "15:00 - 16:00": 0,
                            "16:00 - 17:00": 0,
                            "17:00 - 18:00": 0,
                            "18:00 - 19:00": 0,
                            "19:00 - 20:00": 0,
                            "20:00 - 21:00": 0,
                            "21:00 - 22:00": 0,
                            "22:00 - 23:00": 0,
                            "23:00 - 00:00": 0
                        };

                        API.getLibraryHours({
                            SSO: SSO,
                            selectedDate: $scope.selectedDate
                        }).success(function (data) {
                            if (data != undefined) {
                                console.log("controllers.js: Library Hours: " + JSON.stringify(data));
                                var firstDt = new Date(data.StartTime);
                                console.log("controllers.js: Rounded Start Hours: " + $scope.roundMinutes(firstDt));
                                var firstHr = parseInt($filter('date')(new Date(firstDt), 'HH'));
                                var lastDt = new Date(data.EndTime);
                                console.log("controllers.js: FirstHr: " + firstHr);
                                console.log("controllers.js: Rounded End Hours: " + $scope.roundMinutes(lastDt));
                                var lastHr = parseInt($filter('date')(new Date(lastDt), 'HH'));
                                console.log("controllers.js: LastHr: " + lastHr);
                                var tempHr = "00:00 - 00:01";
                                for (var i = 0; i <= firstHr - 1; i++) {
                                    var temp = i;

                                    if (temp < 9) {
                                        //console.log("0" + temp + ":00 - 0" + ++temp + ":00");
                                        tempHr = "0" + temp + ":00 - 0" + ++temp + ":00";
                                        $scope.hrs[tempHr] = 1;
                                    }
                                    else if (temp == 9) {
                                        //console.log("0" + temp + ":00 - " + ++temp + ":00");
                                        tempHr = "0" + temp + ":00 - " + ++temp + ":00";
                                    }
                                    else if (temp >= 10) {
                                        //console.log(temp + ":00 - " + ++temp + ":00");
                                        tempHr = temp + ":00 - " + ++temp + ":00";
                                    }
                                    console.log("controllers.js: tempHr: " + tempHr);
                                    $scope.hrs[tempHr] = 1;
                                }

                                for (var i = lastHr; i <= 23; i++) {
                                    var temp = i;

                                    if (temp < 9) {
                                        //console.log("0" + temp + ":00 - 0" + temp++ + ":00");
                                        tempHr = "0" + temp + ":00 - 0" + temp++ + ":00";
                                    }
                                    else if (temp == 9) {
                                        //console.log("0" + temp + ":00 - " + temp++ + ":00");
                                        tempHr = "0" + temp + ":00 - " + temp++ + ":00";
                                    }
                                    else if (temp >= 10 && temp < 23) {
                                        //console.log(temp + ":00 - " + temp++ + ":00");
                                        tempHr = temp + ":00 - " + temp++ + ":00";
                                    }
                                    else if (temp == 23) {
                                        //console.log(temp + ":00 - 00:00");
                                        tempHr = temp + ":00 - 00:00";
                                    }
                                    console.log("controllers.js: tempHr: " + tempHr);
                                    $scope.hrs[tempHr] = 1;
                                }
                            }

                        }).error(function (error) {
                            console.log("controllers.js: Something went fishy for getLibraryHours" + error);
                            $rootScope.hide();
                            $rootScope.notify("controllers.js: Duh, we broke in getLibraryHours");
                            $state.go('app.home');
                        });

                        API.getReservedRoomsList({
                            SSO: SSO,
                            selectedDate: $scope.selectedDate,
                            selectedRoomNo: $scope.roomNo
                        }).success(function (data) {
                            if (data != undefined) {
                                $scope.reservedRoomsList = [];


                                console.log("LibraryCtrl: Valid Lib Rooms details");
                                $scope.reservedRoomsList = [];
                                $scope.list = [];
                                for (var i = 0; i < data.length; i++) {
                                    //if (data[i].isCompleted == false) {
                                    $scope.list.push(data[i]);
                                    //}
                                }
                                $scope.concatStr = function (a, b) {
                                    var begin = a;
                                    var end = b;
                                    if (a < 10) {
                                        begin = "0" + a;
                                    }
                                    if (b < 10) {
                                        end = "0" + b;
                                    }
                                    return begin + ":00 - " + end + ":00";
                                }
                                for (var i = 0; i < $scope.list.length; i++) {
                                    $scope.list[i].Dt = $filter('date')(new Date($scope.list[i].EndTime), 'EEE MM-dd-yy');
                                    $scope.startHr = $filter('date')(new Date($scope.list[i].StartTime), 'HH');
                                    $scope.endHr = $filter('date')(new Date($scope.list[i].EndTime), 'HH');
                                    console.log("StartTime: " + $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm'));
                                    $scope.list[i].StartTime = $filter('date')(new Date($scope.list[i].StartTime), 'HH:mm');
                                    console.log("EndtTime: " + $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm'));
                                    $scope.list[i].EndTime = $filter('date')(new Date($scope.list[i].EndTime), 'HH:mm');
                                    $scope.stHr = parseInt($scope.startHr);
                                    $scope.enHr = parseInt($scope.endHr);

                                    var beginHr = $scope.stHr;
                                    for (var j = $scope.stHr; j < $scope.enHr; j++) {

                                        var nextHr = 0;
                                        if ($scope.startHr == 23) {
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

                                for (var hr in $scope.hrs) {
                                    if ($scope.hrs.hasOwnProperty(hr)) {
                                        if ($scope.hrs[hr] == 0) {
                                            $scope.availableHrs.push(hr);
                                        }
                                    }
                                }
                                console.log("cocntrollers.js: Available hours: ");
                                for (var p = 0; p < $scope.availableHrs.length; p++) {
                                    console.log($scope.availableHrs[p]);
                                }
                                console.log("List is: " + $scope.list);
                                $scope.reservedRoomsList = $scope.list;
                                //$scope.ownReservedRoomsList = data;
                                if ($scope.list.length == 0) {
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
                from: new Date(),
                to: new Date(2022, 10, 30),
                inputDate: new Date(),
                mondayFirst: true,
                closeOnSelect: true,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
            console.log("Date value is: " + $scope.selectedDate);
        };
        $scope.cancelReservation = function (reservationID) {
            //console.log("Cancelled");

            var confirmPopup = $ionicPopup.confirm({
                title: 'Cancelling Reserved Room',
                template: 'Are you sure you want to cancel this room reservation?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                    API.cancelReservation({
                        SSO: SSO,
                        reservationID: reservationID,
                        date: new Date()
                    }).success(function (data) {
                        if (data != undefined) {
                            console.log("controllers.js: user " + SSO + " cancelled the room reservation with ID: " + reservationID + ", Status: " + data);
                            $scope.cancelReservationResult = data;
                            $window.location.reload(true);
                            toaster.pop('danger', "Cancelled", "Reservation cacelled");


                        }
                        else {
                            console.log("controllers.js: Error occured cancelling the room reservation");
                            toaster.pop('danger', "Error", "Reservation cacellation error");
                            //$rootScope.hide();
                            //$rootScope.notify("controllers.js: Error occured while fetching the user reserved rooms list");
                            $state.go('app.home');

                        }

                    }).error(function (error) {
                        console.log("controllers.js: Something went fishy for cancelReservation" + error);
                        toaster.pop('danger', "Error", "Reservation cacellation error");
                        $rootScope.hide();
                        $rootScope.notify("controllers.js: Duh, we broke in cancelReservation");
                        $state.go('app.home');
                    });
                } else {
                    console.log('You are not sure');
                }
            });


            $scope.doRefresh = function () {
                $window.location.reload(true);

            };
        }
        //}

    })

    .controller('LabsCtrl', function ($scope, $state, $rootScope, $stateParams, API) {
        var SSO = localStorage.getItem("token");
        console.log("SSO from LabsCtrl: " + SSO);
        API.getLabsList({
            SSO: SSO
        }).success(function (data) {
            if(data != null) {
//              console.log("Valid Labs details from controller"+JSON.stringify(data));
                console.log("Valid Labs details from controller");
                localStorage.setItem("labData", JSON.stringify(data)); 
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
    
        $scope.viewDetails = function(labID){
          localStorage.setItem("labID", labID);
//          alert("Clicked lab "+labID);
            $state.go('app.labInfo');
        }
        
    })
    .controller('LabsDetailCtrl', function($scope, $stateParams) {
            var SSO = localStorage.getItem("token");
            var labId = localStorage.getItem("labID");
            $scope.labID = localStorage.getItem("labID");
            $scope.weekDays = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
//          var labsInfo = localStorage.getItem("labsData");
            var labDataInfo = JSON.parse(localStorage.getItem("labData"));
//          console.log(labDataInfo);
            
            $scope.labsList;
                for (var i = 0; i < labDataInfo.length; i++) {
                    if (labDataInfo[i].ID == labId) {
                    $scope.labsList = labDataInfo[i];
                    }
                }
    
/*            if(SSO == undefined) {
                $state.go('login');
            }
            
*/        })


    .controller('PlaylistCtrl', function($scope, $stateParams) {
        var SSO = localStorage.getItem("token");
        if (SSO == undefined) {
            $state.go('login');
        }
    });
