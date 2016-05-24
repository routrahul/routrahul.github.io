'use strict';

angular.module('stm.selectedAlert', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/selectedAlert', { templateUrl: '/app/views/selectedAlert/selectedAlert.html', controller: 'SelectedAlertCtrl' })
}])


.controller('SelectedAlertCtrl',['$scope','$location','$http','ActionFactory',
  function($scope,$location,$http,ActionFactory){
  $scope.selectedAlert = ActionFactory.getSelectedAlert();
  $scope.selectedAction = ActionFactory.getSelectedAction();
  $scope.showSimilar = false;

  $scope.init = function(){
    for(var i=0;i<$scope.selectedAlert.alert.length;i++)
    {
      if(undefined != similarAlertsObject[$scope.selectedAlert.alert[i].type])
      {
        console.log("Alert Type is same");
        $scope.showSimilar = true;
        for(var j=0;j<similarAlertsObject[$scope.selectedAlert.alert[i].type].action.length;j++)
        {
          if(similarAlertsObject[$scope.selectedAlert.alert[i].type].action[j].selected)
          {
            $scope.similarAlertsObjectScope = similarAlertsObject[$scope.selectedAlert.alert[i].type].action[j];
            break;
          }
        }
        break;
      }
      else {
        $scope.showSimilar = false;
      }
    }
  }();

  $scope.selectAlert = function(obj)
  {
    for(var i=0;i<ActionFactory.getSelectedAlert().alert.length;i++)
    {
       ActionFactory.getSelectedAlert().alert[i].selected = false;
    }
    obj.selected = true;
    ActionFactory.setSelectedAction(obj.action);
    $scope.selectedAction = obj.action;
  }

  $scope.storeSelectedAction = function(){
    var selectedAlert = $scope.selectedAlert;
    for(var i=0;i<selectedAlert.alert.length;i++)
    {
      if(selectedAlert.alert[i].selected == true)
      {
        selectedAlert.alert[i].active = false;
        var counterForAlerts = i;
        counterForAlerts++;
        selectedAlert.alert[counterForAlerts].selected = true;
        // ActionFactory.setSelectedAlert(selectedAlert.alert[counterForAlerts]);
        ActionFactory.setSelectedAction(selectedAlert.alert[counterForAlerts].action);
        $scope.selectedAction = ActionFactory.getSelectedAction();
        // $scope.selectedAlert = ActionFactory.getSelectedAlert();

        for(var j=0;i<selectedAlert.alert[i].action.length;j++)
        {
          if(selectedAlert.alert[i].action[j].selected == true)
          {
            if(undefined == similarAlertsObject[selectedAlert.alert[i].type])
            {
              similarAlertsObject[selectedAlert.alert[i].type] = selectedAlert.alert[i];
            }
            // $location.path("/landing");
            break;
          }

        }
        break;
      }
    }
    // $location.path("/landing");
  }

  $scope.captureSelectedAction = function(obj){
    obj.selected = true;
  }
}])
