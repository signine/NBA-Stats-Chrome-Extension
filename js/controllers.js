function getDate(offset) {
  var d = new Date(new Date().setDate(new Date().getDate() + offset)); 
  return d;
}
var ctrl = angular.module('Controllers', []) 

var REFRESH_RATE = 60*1000;

var refresher_set = false;

ctrl.controller('ScoreBoardCtrl', function($scope, $timeout) {
  $scope.supported_dates = [getDate(-1), getDate(0), getDate(1)];
  $scope.todays_date = $scope.supported_dates[1]; 
  $scope.current_date = $scope.supported_dates[1]; 
  $scope.current_date_id = 1;
  $scope.refresh = 0;

  $scope.load_scoreboard = function(date, force) {
    StatsService.getScoreBoard(date, force, function() {
      $scope.games = StatsService.DATA.games[date.toDateString()];
      $scope.$apply();
    });
  }

  $scope.prevDate = function() {
    if ($scope.current_date_id > 0) {
      $scope.current_date_id--;
      $scope.current_date = $scope.supported_dates[$scope.current_date_id];
      $scope.load_scoreboard($scope.current_date, false);
    }
  }

  $scope.nextDate = function() {
    if ($scope.current_date_id < 2) {
      $scope.current_date_id++;
      $scope.current_date = $scope.supported_dates[$scope.current_date_id];
      $scope.load_scoreboard($scope.current_date, false);
    }
  }

  $scope.load_scoreboard($scope.current_date, true);

  if (refresher_set == false) {
    setInterval(function() {
      StatsService.getScoreBoard($scope.todays_date, true, function() {
        $scope.games = StatsService.DATA.games[$scope.supported_dates[1].toDateString()];
        $scope.refresh += 1;
        $scope.$apply();
      });
    }, REFRESH_RATE); 
    refresher_set = true;
  }

  $scope.openBoxscore = function(gameId) {
    var game = StatsService.DATA.games[$scope.current_date.toDateString()][gameId];
    chrome.tabs.create({ url: game.boxscore_link });
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
