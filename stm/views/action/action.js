'use strict';

angular.module('stm.action', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/action', { templateUrl: '/app/views/action/action.html', controller: 'ActionCtrl' })
}])


.controller('ActionCtrl',['$scope','$location','$http','ActionFactory',function($scope,$location,$http,ActionFactory){
  $scope.selectedAction = ActionFactory.getSelectedAlert();

  $scope.actionTaken = function(){
    $location.path("/landing");
  }
}])
