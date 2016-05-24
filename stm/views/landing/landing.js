'use strict';

angular.module('stm.landing', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/landing', { templateUrl: 'views/landing/landing.html', controller: 'LandingCtrl' })
}])


.controller('LandingCtrl',['$scope','$location','$http','ActionFactory','$interval',
  function($scope,$location,$http,ActionFactory,$interval){

      // var intervalObject = $interval(function() {
      //
      // });

      $scope.init = function(){
        $('.carousel').carousel({
          interval: 1500
        });
      }();

      $scope.openSnowModal = function(obj)
      {
        console.log(obj);
        $scope.modalSelectedObject = obj;
        ActionFactory.setSelectedAlert(obj);
        $location.path("/action");
      //  $("#snowModal").modal();
      }

      $scope.moreAlertsSelectedObject = function(obj)
      {
        obj.alert[0].selected = true;
        ActionFactory.setSelectedAction(obj.alert[0].action);
        ActionFactory.setSelectedAlert(obj);
        $location.path("/selectedAlert");
      }

      $scope.moreAlertsObject = moreAlertsObjectGlobal;

      $scope.criticalAlertsObj = criticalAlertsObjGlobal;
}])
