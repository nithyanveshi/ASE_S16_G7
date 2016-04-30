/**
 * Created by meets on 4/1/2016.
 */
angular.module('starter.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {
        var base = "http://ec2-52-34-188-157.us-west-2.compute.amazonaws.com";
      //var base = "http://localhost:9000";
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };
        $rootScope.hide = function () {
            $ionicLoading.hide();
        };
        $rootScope.logout = function () {
            $rootScope.setToken("");
            $window.location.href = '#/auth/signin';
        };
        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
                $rootScope.hide();
            }, 1999);
        };
        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else
                $rootScope.$broadcast('fetchCompleted');
            $rootScope.$broadcast('scroll.refreshComplete');
        };
        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }
        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }
        return {
            login: function (form) {
                return $http.post(base+'/login', form);
                //console.log("Status: " + stat);
                //return stat;
            },
            signup: function (form) {
                return $http.post(base+'/api/v1/bucketList/auth/register', form);
            },
            getLibraryDetails: function (form) {
                console.log("SSO from services.js: " + form.SSO);
                return $http.post(base+'/library', form);
            },
            getHolidays: function (form) {
                console.log("services.js: SSO from getHolidays: " + form.SSO);
                return $http.post(base+'/getHolidays', form);
            },
	    	getProfileDetails: function(form){
				console.log("services.js: SSO from getProfileDetails: " + form.SSO);
				return $http.post(base+'/profile', form);
			},
            
            registerUser:function(form){
                console.log("services.js: SSO from registerUser: " + form.SSO);
				return $http.post(base+'/registerUser', form);
            },
            getLibRoomsList: function (form) {
            console.log("SSO from services.js: " + form.SSO);
            return $http.post(base+'/libRoomsList', form);
          },
            editUserProfile: function(form) {
              console.log("services.js: SSO from editUserProfile:" + form.SSO);
                return $http.post(base+'/editUserProfile',form);
            },
            editUserPassword: function(form) {
              console.log("services.js: SSO from editUserPassword:" + form.SSO);
                return $http.post(base+'/editUserPassword',form);
            },
            updateFullShift: function (form) {
                console.log("services.js: SSO from getHolidays: " + form.SSO);
                return $http.post(base+'/updateFullShift', form);
            },
            updateOwnerFullShift: function (form) {
                return $http.post(base+'/updateOwnerFullShift', form);
            },
            insertHalfShift: function (form) {
                return $http.post(base+'/insertHalfShift', form);
            },
            getDues: function (form) {
                console.log("services.js: SSO from getDues: " + form.SSO);
                return $http.post(base+'/getDues', form);
            },
			getProfileDetails: function(form){
				console.log("services.js: SSO from getProfileDetails: " + form.SSO);
				return $http.post(base+'/profile', form);//,{
                  //  method : 'GET',
                    //    params:{
                      //      token:form.SSO
                      //  }   
               // }
			},
            getLibRoomsList: function (form) {
            console.log("SSO from services.js: " + form.SSO);
            return $http.post(base+'/libRoomsList', form);//, {
            //    method: 'GET',
            //    params: {
            //        token: form.SSO
            //    }
            //});
          },
            cacheUserProfile: function (form) {
                console.log("services.js: SSO from cacheUserProfile: " + form.SSO);
                return $http.post(base+'/cacheUserProfile', form);
            },
            getEnrollments: function (form) {
                console.log("services.js: SSO from cacheUserProfile: " + form.SSO);
                return $http.post(base+'/getEnrollments', form);
            },
            getLibraryHours: function (form) {
                console.log("services.js: SSO from getLibraryHours: " + form.SSO);
                console.log("services.js: Date from getLibraryHours: " + form.selectedDate);
                return $http.post(base+'/getLibraryHours', form);

            },
            newRoomReservation: function (form) {
                console.log("services.js: SSO from newRoomReservation: " + form.Login_ID);
                return $http.post(base+'/newRoomReservation', form);
            },
            getReservedRoomsList: function (form) {
                console.log("SSO from getReservedRoomsList of services.js" + form.SSO);
                return $http.post(base+'/roomReserveList', form);// {
                    //method: 'GET',
                    //params: {
                    //    token: SSO
                    //}
             //   });
            },
            cancelReservation: function (form) {
                console.log("services.js: SSO from cancelReservation: " + form.SSO);
                console.log("services.js: Room ID from cancelReservation: " + form.reservationID);
                return $http.post(base+'/cancelReservation', form);

            },
	    getShiftDetails: function (form) {
                console.log("SSO from services.js: " + form.SSO);
                return $http.post(base+'/shifts', form);//, {
                //    method: 'GET',
                //    params: {
                //        token: form.SSO
            //    }
                //});
            },
            getSubDetails: function (form) {
                console.log("SSO from services.js: " + form.SSO);
                return $http.post(base+'/subs', form);//, {
                //    method: 'GET',
                //    params: {
                //        token: form.SSO
            //    }
                //});
            },
	    getLabsList: function (form) {
            console.log("SSO from services.js: " + form.SSO);
            return $http.post(base+'/labs', form);
            },
            getOwnReservedRoomsList: function (form) {
                console.log("SSO from getOwnReservedRoomsList of services.js " + form.SSO);
                return $http.post(base+'/ownRoomReserveList', form);// {
                //method: 'GET',
                //params: {
                //    token: SSO
                //}
                //   });
            },
            saveItem: function (form, email) {
                return $http.post(base+'/api/v1/bucketList/data/item', form, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            putItem: function (id, form, email) {
                return $http.put(base+'/api/v1/bucketList/data/item/' + id, form, {
                    method: 'PUT',
                    params: {
                        token: email
                    }
                });
            },
            deleteItem: function (id, email) {
                return $http.delete(base+'/api/v1/bucketList/data/item/' + id, {
                    method: 'DELETE',
                    params: {
                        token: email
                    }
                });
            }
        }
    });