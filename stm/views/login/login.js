'use strict';

angular.module('stm.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/login', { templateUrl: 'views/login/login.html', controller: 'LoginCtrl' })
}])


.controller('LoginCtrl',['$scope','$location','$http','ActionFactory','$interval',
  function($scope,$location,$http,ActionFactory,$interval){

    $scope.showDeptSelection = false,$scope.showLogin = true;
    $scope.selectedStore = "Select Store",$scope.selectedDepartment = "Select Department";
    $scope.stores = [
      {
        "storeid":"Store - 1",
        "name":"Store - 1"
      },
      {
        "storeid":"Store - 2",
        "name":"Store - 2"
      },
      {
        "storeid":"Store - 3",
        "name":"Store - 3"
      }
    ];
    $scope.departments = [
      {
        "deptid":"Dept - 1",
        "name":"Department - 1"
      },
      {
        "deptid":"Dept - 2",
        "name":"Department - 2"
      },
      {
        "deptid":"Dept - 3",
        "name":"Department - 3"
      }
    ]

    $scope.loginFunction = function(){
      $scope.showDeptSelection = true;
      $scope.showLogin = false;
    }

    $scope.selectStore = function(obj){
      $scope.selectedStore = obj.name;
    }

    $scope.selectDepartment = function(obj){
      $scope.selectedDepartment = obj.name;
    }

    $scope.gotoLanding = function(){
      $location.path("/landing");
    }

}])
