angular.module('clipr.sidebar',['ui.router'])

.controller('SidebarController',['$scope', 'Clips', function($scope, Clips){

  $scope.categories= Clips.clips;

  $scope.loadClipsByCategory= function(category){
  	console.log('category', category);
  	Clips.loadClipsByCategory(category);
  };

}]);




