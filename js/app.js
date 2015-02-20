var app = angular.module('NBA', ['ngRoute', 'Controllers'])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);

app.config(['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        when('/boxscore/:gameId', {
          templateUrl: 'boxscore.html',
          controller: 'BoxscoreCtrl'
        }).
        otherwise({
          templateUrl: 'scoreboard.html',
          controller: 'ScoreBoardCtrl'
        });
    }]);

