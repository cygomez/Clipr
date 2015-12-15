/**
 * Main module of the application.
 */
angular
    .module('cliprApp', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngTouch',
        'clipr.services',
        'clipr.clipped',
        'clipr.categories',
        'xeditable',
        'ngDragDrop'
    ])


.run(function($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      if (toState.authenticate && !AuthService.isAuthenticated()) {
        $state.transitionTo("landing");
        event.preventDefault();
      }
    });
  })
  .controller("AppController", ['$scope', '$location', function($scope, $location) {
    //authentication
  }])

//Configure routes for each state of the application
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/clips');

  $stateProvider
    .state('landing', {
      url: "/",
      views: {
        "main": {
          templateUrl: 'html/landingView.html',
          controller: 'ClipController'
        }
      }
    })
    .state('categories', {
      url: "/categories",
      views: {
        "main": {
          templateUrl: 'html/categories.html',
          controller: 'CategoryController'
        },
        "header@categories": {
          templateUrl: 'html/header.html',
          controller: 'ClipController'
        }
      }
    })
    .state('main', {
      authenticate: true,
      url: "/clips",
      views: {
        "main": {
          templateUrl: 'html/clippedView.html',
          controller: 'ClipController'
        },
        "header@categories": {
          templateUrl: 'html/header.html',
          controller: 'ClipController'
        }
      }
    });

}]);