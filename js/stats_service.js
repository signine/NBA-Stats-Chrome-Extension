StatsService = new Object(); 
var s = StatsService;
s.BASE_URL = 'http://stats.nba.com/stats/';
s.URLS = {'scoreboard': 'scoreboard', 'boxscore': 'boxscore'}
s.BOXSCORE_BASE = "http://www.nba.com/games/";
s.BOXSCORE_END = "/gameinfo.html";
s.DEFAULT_PARAMS = {'LeagueID': '00', 'DayOffset': 0, 'RangeType': 0, 'StartRange': 0, 'EndRange': 0, 'StartPeriod': 0, 'EndPeriod': 0};
s.DATA = new Object();
s.DATA.ready = false;
//s.DATA.boxscore = {};
s.DATA.games = {};

var teamData = new Array();
teamData["Boston Celtics"] = ["#01ad3a", "BC.png"];
teamData["Dallas Mavericks"] = ["#10aef8", "DM.png"];
teamData["Brooklyn Nets"] = ["#3d3d3d", "BN.png"];
teamData["Houston Rockets"] = ["#e62a11", "HR.png"];
teamData["New York Knicks"] = ["#e68e11", "NYK.png"];
teamData["Memphis Grizzlies"] = ["#123d53", "MG.png"];
teamData["Philadelphia 76ers"] = ["#e01251", "P7.png"];
teamData["New Orleans Pelicans"] = ["#459c80", "NOP.png"];
teamData["Toronto Raptors"] = ["#861634", "TR.png"];
teamData["San Antonio Spurs"] = ["#6c6c6c", "SAS.png"];
teamData["Chicago Bulls"] = ["#d91515", "CB.png"];
teamData["Denver Nuggets"] = ["#eeb509", "DN.png"];
teamData["Cleveland Cavaliers"] = ["#c94955", "CC.png"];
teamData["Minnesota Timberwolves"] = ["#0d920a", "MT.png"];
teamData["Detroit Pistons"] = ["#d74257", "DP.png"];
teamData["Oklahoma City Thunder"] = ["#15b5ea", "OKC.png"];
teamData["Indiana Pacers"] = ["#cfb650", "IP.png"];
teamData["Portland Trail Blazers"] = ["#5d0f24", "PTB.png"];
teamData["Milwaukee Bucks"] = ["#0f5d12", "MB.png"];
teamData["Utah Jazz"] = ["#437f9b", "UJ.png"];
teamData["Atlanta Hawks"] = ["#772a2a", "AH.png"];
teamData["Golden State Warriors"] = ["#0145ad", "GSW.png"];
teamData["Charlotte Hornets"] = ["#204b69", "CH.png"];
teamData["Los Angeles Clippers"] = ["#cd1ad4", "LAC.png"];
teamData["Miami Heat"] = ["#c5002e", "MH.png"];
teamData["Los Angeles Lakers"] = ["#7d00c5", "LAL.png"];
teamData["Orlando Magic"] = ["#1480f8", "OM.png"];
teamData["Phoenix Suns"] = ["#f8a014", "PS.png"];
teamData["Washington Wizards"] = ["#1480f8", "WW.png"];
teamData["Sacramento Kings"] = ["#480974", "SK.png"];

var TeamFullNames = 
{
  "BOS": "Boston Celtics",
  "DAL": "Dallas Mavericks",
  "BKN": "Brooklyn Nets",
  "HOU": "Huston Rockets",
  "NYK": "New York Knicks",
  "MEM": "Memphis Grizzlies",
  "PHI": "Philadelphia 76ers",
  "NOP": "New Orleans Pelicans",
  "TOR": "Toronto Raptors",
  "SAS": "San Antonio Spurs",
  "CHI": "Chicago Bulls",
  "DEN": "Denver Nuggets",
  "CLE": "Cleveland Cavaliers",
  "MIN": "Minnesota Timberwolves",
  "DET": "Detroit Pistons",
  "OKC": "Oklahoma Thunder",
  "IND": "Indiana Pacers",
  "POR": "Portland Trail Blazers",
  "MIL": "Milwaukee Bucks",
  "UTA": "Utah Jazz",
  "ATL": "Atlanta Hawks",
  "GSW": "Golden State Warriors",
  "CHA": "Charlotte Hornets",
  "LAC": "Los Angeles Clippers",
  "LAL": "Los Angeles Lakers",
  "MIA": "Miami Heat",
  "ORL": "Orlando Magic",
  "PHX": "Phoenix Suns",
  "WAS": "Washington Wizards",
  "SAC": "Sacramento Kings"
}


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

s.parseScoreboard = function(date, data) {
  var games = {}; 
  for (id in data.resultSets[0].rowSet) {
    _data = data.resultSets[0].rowSet[id];
    var game = new Object();
    game.id = _data[2];
    game.status = _data[4];
    game.time = _data[10];
    game.boxscore_link = s.BOXSCORE_BASE + _data[5] + s.BOXSCORE_END; 

    var line_score = '';;
    var j = 0;
    for (;j < data.resultSets[1].rowSet.length; j++) {
      line_score = data.resultSets[1].rowSet[j];
      if (line_score[2] == game.id) { break }
    }
    game.team_1 = TeamFullNames[line_score[4]];
    game.team_1_score = line_score[21];

    for (j++ ;j < data.resultSets[1].rowSet.length; j++) {
      line_score = data.resultSets[1].rowSet[j];
      if (line_score[2] == game.id) { break }
    }
    game.team_2 = TeamFullNames[line_score[4]];
    game.team_2_score = line_score[21];

    //game.team_1_colour = teamData[game.team_1][0];
    //game.team_1_icon = teamData[game.team_1][1];
    //game.team_2_colour = teamData[game.team_2][0];
    //game.team_2_icon = teamData[game.team_2][1];
    games[game.id] = game;
  }
  s.DATA.games[date.toDateString()] = games;
}

s.getScoreBoard = function(date, force, callback) {
  if (!force && s.DATA.games[date.toDateString()]) {
    callback()
    return;
  }

  var url = s.BASE_URL + s.URLS['scoreboard'];
  s.make_request(url, {'GameDate': date.toLocaleDateString()}, function(data) {
    s.parseScoreboard(date, data); 
    callback();
  });
}


/*
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
    pstats.push(p[26]); // PTS 

    ret.push(pstats);
  }

  return ret;
}

s.parseBoxscore = function(data) {
  bscore = new Object();
  bscore.status = data.resultSets[0].rowSet[0][4];
  bscore.time = data.resultSets[0].rowSet[0][10];
  

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
*/
