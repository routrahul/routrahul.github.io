'use strict';

angular.module('stm.action', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/action', { templateUrl: 'views/action/action.html', controller: 'ActionCtrl' })
}])


.controller('ActionCtrl',['$scope','$location','$http','ActionFactory',function($scope,$location,$http,ActionFactory){
  $scope.selectedAction = ActionFactory.getSelectedAlert();

  $scope.title = "";
  $scope.text = "";

  $scope.addNewItem = false;

  $scope.actionTaken = function(){
    $location.path("/landing");
  }

  $scope.newItemAddition = function(){
    $scope.addNewItem = true;
  }

  $scope.addItem = function(){
    $scope.selectedAction.actions.push({
      selected:false,
      subtext:$scope.title,
      text: $scope.text
    });
    $scope.addNewItem = false;
  }
}])
