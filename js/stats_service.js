StatsService = new Object(); 
var s = StatsService;
s.BASE_URL = 'http://stats.nba.com/stats/';
s.SCORE_BOARD_URL = 'scoreboard';
s.DEFAULT_PARAMS = {'LeagueID': '00', 'DayOffset': 0};
s.DATA = new Object();
s.DATA.ready = false;

s.make_request = function(url, params, callback) {
  $.ajax({
    url: url,
    jsonp: 'callback',
    dataType: 'json',
    jsonp: false,
    data: $.extend({}, s.DEFAULT_PARAMS, params),
    success: callback  
  });
}

s.getTodaysDate = function() {
  var d = new Date();
  return d.toLocaleDateString();
}

s.parseScoreboard = function(data) {
  console.log(data);
  s.DATA.games = [];
  
  for (id in data.resultSets[0].rowSet) {
    _data = data.resultSets[0].rowSet[id];
    var game = new Object();
    game.id = _data[2];
    game.status = _data[4];

    var line_score = '';;
    var j = 0;
    for (;j < data.resultSets[1].rowSet.length; j++) {
      line_score = data.resultSets[1].rowSet[j];
      if (line_score[2] == game.id) { break }
    }
    game.team_1 = line_score[5];
    game.team_1_score = line_score[21];

    for (j++ ;j < data.resultSets[1].rowSet.length; j++) {
      line_score = data.resultSets[1].rowSet[j];
      if (line_score[2] == game.id) { break }
    }
    game.team_2 = line_score[5];
    game.team_2_score = line_score[21];

    s.DATA.games.push(game);
  }
}

s.getScoreBoard = function(callback) {
  var url = s.BASE_URL + s.SCORE_BOARD_URL;
  s.make_request(url, {'GameDate': s.getTodaysDate()}, function(data) {
    s.parseScoreboard(data); 
    callback();
  });
}
