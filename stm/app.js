angular.module('storemanager', [
  'ngRoute',
  'stm.landing',
  'stm.action',
  'stm.selectedAlert',
  'stm.login'
])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .otherwise({redirectTo: '/login'})
}])

.factory('ActionFactory',[function(){
  var selectedAlert = null;
  var selectedAction = null;
  return {
    getSelectedAlert:function(){
      return selectedAlert
    },
    setSelectedAlert:function(obj){
      selectedAlert = obj;
    },
    getSelectedAction:function(){
      return selectedAction
    },
    setSelectedAction:function(obj){
      selectedAction = obj;
    }
  }
}])
