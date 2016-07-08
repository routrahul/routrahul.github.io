'use strict';

angular.module('stm.selectedAlert', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/selectedAlert', { templateUrl: 'views/selectedAlert/selectedAlert.html', controller: 'SelectedAlertCtrl' })
}])


.controller('SelectedAlertCtrl',['$scope','$location','$http','ActionFactory',
  function($scope,$location,$http,ActionFactory){
  $scope.selectedAlert = ActionFactory.getSelectedAlert();
  // $scope.selectedAction = ActionFactory.getSelectedAction();
  $scope.showSimilar = false;

  $scope.openSnowModal = function(obj)
  {
    console.log(obj);
    $scope.modalSelectedObject = obj;
    ActionFactory.setSelectedAlert(obj);
    $location.path("/action");
  //  $("#snowModal").modal();
  }
}])
