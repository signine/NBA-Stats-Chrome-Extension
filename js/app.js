var app = angular.module('NBA', []);

var REFRESH_RATE = 30*1000;

app.controller('ScoreBoardCtrl', function($scope, $timeout) {
  $scope.update = function() {
    $scope.games = StatsService.DATA.games;
    $scope.refresh += 1;
    $scope.$apply();
  };

  StatsService.getScoreBoard(function() {
    $scope.games = StatsService.DATA.games;
    $scope.refresh = 0;
    $scope.update();
  });

  setInterval(function() {
    StatsService.getScoreBoard(function() {
      $scope.update();
    });
  }, REFRESH_RATE); 
});
