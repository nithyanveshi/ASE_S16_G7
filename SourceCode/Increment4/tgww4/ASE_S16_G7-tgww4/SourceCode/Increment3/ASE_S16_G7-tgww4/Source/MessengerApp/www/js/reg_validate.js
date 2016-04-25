//defining module
var myapp = angular.module('myapp', []);

//creating custom directive
myapp.directive('ngCompare', function () {
    return {
        require: 'ngModel',
        link: function (scope, currentEl, attrs, ctrl) {
            var comparefield = document.getElementsByName(attrs.ngCompare)[0]; //getting first element
            compareEl = angular.element(comparefield);

            //current field key up
            currentEl.on('keyup', function () {
                if (compareEl.val() != "") {
                    var isMatch = currentEl.val() === compareEl.val();
                    ctrl.$setValidity('compare', isMatch);
                    scope.$digest();
                }
            });

            //Element to compare field key up
            compareEl.on('keyup', function () {
                if (currentEl.val() != "") {
                    var isMatch = currentEl.val() === compareEl.val();
                    ctrl.$setValidity('compare', isMatch);
                    scope.$digest();
                }
            });
        }
    }
});

// create angular controller
myapp.controller('mainController', function ($scope) {

    $scope.countryList = [
    { CountryId: 1, Name: 'India' },
    { CountryId: 2, Name: 'USA' }
    ];

    $scope.cityList = [];

    $scope.$watch('user.country', function (newVal, oldVal) {

        if (newVal == 1)
            $scope.cityList = [
                                { CountryId: 1, CityId: 1, Name: 'Noida' },
                                { CountryId: 1, CityId: 2, Name: 'Delhi' }];
        else if (newVal == 2)
            $scope.cityList = [
                               { CountryId: 2, CityId: 3, Name: 'Texas' },
                               { CountryId: 2, CityId: 4, Name: 'NewYork' }];
        else
            $scope.cityList = [];
    });

    // function to submit the form after all validation has occurred			
    $scope.submitForm = function () {

        // Set the 'submitted' flag to true
        $scope.submitted = true;

        if ($scope.userForm.$valid) {
            alert("Form is valid!");
        }
        else {
            alert("Please correct errors!");
        }
    };
});
