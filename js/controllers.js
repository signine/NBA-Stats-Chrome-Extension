function getDate(offset) {
  var d = new Date(new Date().setDate(new Date().getDate() + offset)); 
  return d;
}
var ctrl = angular.module('Controllers', []) 

var REFRESH_RATE = 30*1000;

var refresher_set = false;

ctrl.controller('ScoreBoardCtrl', function($scope, $timeout) {
  $scope.supported_dates = [getDate(-1), getDate(0), getDate(1)];
  $scope.current_date = $scope.supported_dates[1]; 
  $scope.current_date_id = 1;

  $scope.load_scoreboard = function(dates) {
    StatsService.getScoreBoard(dates, function() {
      $scope.games = StatsService.DATA.games[$scope.current_date];
      $scope.$apply();
    });
  }

  $scope.prevDate = function() {
    if ($scope.current_date_id > 0) {
      $scope.current_date_id--;
      $scope.current_date = $scope.supported_dates[$scope.current_date_id];
      $scope.load_scoreboard([$scope.current_date]);
    }
  }

  $scope.nextDate = function() {
    if ($scope.current_date_id < 2) {
      $scope.current_date_id++;
      $scope.current_date = $scope.supported_dates[$scope.current_date_id];
      $scope.load_scoreboard([$scope.current_date]);
    }
  }

  $scope.load_scoreboard($scope.supported_dates);

  if (refresher_set == false) {
    setInterval(function() {
      StatsService.updateCurrentScores(function() {
        $scope.games = StatsService.DATA.games[$scope.supported_dates[1]]; // Today's date id
        $scope.$apply();
      });
    }, REFRESH_RATE); 
    refresher_set = true;
  }

  $scope.openBoxscore = function(boxscore_link) {
    chrome.tabs.create({ url: boxscore_link });
  }
});
