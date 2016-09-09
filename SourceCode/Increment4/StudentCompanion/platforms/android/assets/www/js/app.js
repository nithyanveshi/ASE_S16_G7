// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'toaster', 'starter.controllers', 'starter.services', 'ionic-datepicker', 'ngAnimate', 'ngSanitize'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })

            .state('app.labs', {
                url: '/labs',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/labs.html',
                        controller: 'LabsCtrl'
                    }
                }
            })
        .state('app.labInfo', {
                url: '/labInfo',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/labInfo.html',
                        controller: 'LabsDetailCtrl'
                    }
                }
            })
        
		.state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
  })
		.state('app.contactus', {
                url: '/contactus',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contactus.html'
                    }
                }
            })
            .state('app.profile', {
						url: '/profile', 
				views:{
                    'menuContent':{
				     templateUrl: 'templates/profile.html',
						controller: 'ProfileCtrl'
						}
					}
                })
        .state('app.editprofile',{
            url:'/editprofile',
            views:{
                'menuContent':{
                    templateUrl:'templates/editprofile.html',
                    controller:'ProfEditCtrl'
                }
            }
        })
        .state('app.editpassword',{
            url:'/editpassword',
            views:{
                'menuContent':{
                    templateUrl:'templates/editpassword.html',
                  // controller:'PwdEditCtrl'
                }
            }
        })
            .state('app.library', {
                url: '/library',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/library.html',
                        controller: 'LibraryCtrl'
                    }
                }
            })
            .state('app.libRoomsList', {
                url: '/libRoomsList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/libRoomsList.html',
                        controller: 'LibraryCtrl'
                    }
                }
            })
            .state('app.roomReserve', {
                url: '/roomReserve',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/roomReserve.html',
                        controller: 'LibraryCtrl'
                    }
                }
            })
            .state('app.confirmRoomReserve', {
                url: '/confirmRoomReserve',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/confirmRoomReserve.html',
                        controller: 'RoomReserveCtrl'
                    }
                }
            })
            .state('app.reservedRooms', {
                url: '/reservedRooms',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservedRooms.html',
                        controller: 'LibraryCtrl'
                    }
                }
            })
            .state('app.playlists', {
                url: '/playlists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlists.html',
                        controller: 'PlaylistsCtrl'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.samenu', {
                url: '/samenu',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/samenu.html',
                        controller: 'SamenuCtrl'
                    }
                }
            })
            .state('app.takeShift', {
                url: '/takeShift',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/takeShift.html',
                        controller: 'TakeShiftCtrl'
                    }
                }
            })
            .state('app.postShift', {
                url: '/postShift',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/postShift.html',
                        controller: 'PostShiftCtrl'
                    }
                }
            })
            .state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
