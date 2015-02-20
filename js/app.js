var app = angular.module('NBA', ['ngRoute', 'Controllers']);

app.config(['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        when('/boxscore/:gameid', {
          templateUrl: 'boxscore.html',
          controller: 'BoxscoreCtrl'
        }).
        otherwise({
          templateUrl: 'scoreboard.html',
          controller: 'ScoreBoardCtrl'
        });
    }]);

