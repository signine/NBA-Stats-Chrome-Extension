StatsService = new Object(); 
var s = StatsService;
s.BASE_URL = 'http://stats.nba.com/stats/';
s.URLS = {'scoreboard': 'scoreboard', 'boxscore': 'boxscore'}
s.DEFAULT_PARAMS = {'LeagueID': '00', 'DayOffset': 0, 'RangeType': 0, 'StartRange': 0, 'EndRange': 0, 'StartPeriod': 0, 'EndPeriod': 0};
s.DATA = new Object();
s.DATA.ready = false;
s.DATA.boxscore = {};

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
  var url = s.BASE_URL + s.URLS['scoreboard'];
  s.make_request(url, {'GameDate': s.getTodaysDate()}, function(data) {
    s.parseScoreboard(data); 
    callback();
  });
}

s.parseTeamStats = function(stats) {
  var ret = []
  ret.push(stats[5]); //MIN
  ret.push(stats[6] + "-" + stats[7]); //FGM - FGA
  ret.push(stats[9] + "-" + stats[10]); //3FGM - 3FGA
  ret.push(stats[12] + "-" + stats[13]); //FTM - FTA
  ret.push(stats[24]); // +-
  ret.push(stats[15]); // Off Reb
  ret.push(stats[16]); // Def Reb
  ret.push(stats[17]); // Reb
  ret.push(stats[18]); // Ast 
  ret.push(stats[22]); // PF
  ret.push(stats[19]); // STL
  ret.push(stats[21]); // TO
  ret.push(stats[20]); // BLK
  ret.push(stats[23]); // PTS 
  return ret;
}

s.parsePlayerStats = function(team, players) {
  var ret = [], p;

  for (var i = 0; i < players.length; i++) {
    p = players[i];
    if (p[3] != team) { continue };

    var pstats = [];
    pstats.push(p[5]); // Name
    pstats.push(p[6]); // Pos 
    pstats.push(p[8]); // Min 
    pstats.push(p[8]); // Min 
    pstats.push(p[9] + "-" + p[10]); // FGM - FGA
    pstats.push(p[12] + "-" + p[13]); // 3FGM - 3FGA
    pstats.push(p[15] + "-" + p[16]); // FTA - FTM 
    pstats.push(p[27]); // +- 
    pstats.push(p[18]); // Off Reb
    pstats.push(p[19]); // Def Reb
    pstats.push(p[20]); // Reb
    pstats.push(p[21]); // Ast 
    pstats.push(p[25]); // PF
    pstats.push(p[22]); // STL
    pstats.push(p[24]); // TO
    pstats.push(p[23]); // BLK
    pstats.push(p[26]); // PYS 

    ret.push(pstats);
  }

  return ret;
}

s.parseBoxscore = function(data) {
  bscore = new Object();
  bscore.status = data.resultSets[0].rowSet[0][4];

  // Summary
  bscore.team_1 = data.resultSets[1].rowSet[0][5];
  bscore.team_1_final = data.resultSets[1].rowSet[0][21];
  bscore.team_1_scores = data.resultSets[1].rowSet[0].splice(7, 14);

  bscore.team_2 = data.resultSets[1].rowSet[1][5];
  bscore.team_2_final = data.resultSets[1].rowSet[1][21];
  bscore.team_2_scores = data.resultSets[1].rowSet[1].splice(7, 14);

  // Team Stats
  bscore.team_1_stats = s.parseTeamStats(data.resultSets[5].rowSet[0]);
  bscore.team_2_stats = s.parseTeamStats(data.resultSets[5].rowSet[1]);

  // Player Stats
  bscore.team_1_players = s.parsePlayerStats(bscore.team_1, data.resultSets[4].rowSet);
  bscore.team_2_players = s.parsePlayerStats(bscore.team_2, data.resultSets[4].rowSet);

  return bscore;
}

s.getBoxscore = function(game_id, callback) {
  var url = s.BASE_URL + s.URLS['boxscore'];
  s.make_request(url, {'GameID': game_id}, function(data) {
    var boxscore = s.parseBoxscore(data);
    callback(boxscore);
  });
}
