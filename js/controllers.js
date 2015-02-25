var ctrl = angular.module('Controllers', []) 

var REFRESH_RATE = 60*1000;

var refresher_set = false;
ctrl.controller('ScoreBoardCtrl', function($scope, $timeout) {
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

  if (refresher_set == false) {
    setInterval(function() {
      StatsService.getScoreBoard(function() {
        $scope.update();
      });
    }, REFRESH_RATE); 
    refresher_set = true;
  }
});

/*
ctrl.controller('BoxscoreCtrl', function($scope, $routeParams) {
  StatsService.getBoxscore($routeParams.gameId, function(boxscore) {
    $scope.bs = boxscore;   
    $scope.$apply();
    console.log(bscore);
  });
});
*/
