StatsService = new Object(); 
var s = StatsService;
s.SCOREBOARD_URL = 'http://stats.tsn.ca/GET/urn:tsn:nba:scoreboard'
s.BOXSCORE_BASE = "http://www.nba.com/games/";
s.BOXSCORE_END = "/gameinfo.html";
s.DEFAULT_PARAMS = {'type': 'json'}
s.DATA = new Object();
s.DATA.games = new Array();

var teamData = 
{
  "Celtics" : ["Boston Celtics", "BOS", "#01ad3a", "BC.png"],
  "Mavericks" : ["Dallas Mavericks", "DAL", "#10aef8", "DM.png"],
  "Nets" : ["Brooklyn Nets", "BKN", "#3d3d3d", "BN.png"],
  "Rockets" : ["Houston Rockets","HOU", "#e62a11", "HR.png"],
  "Knicks" : ["New York Knicks","NYK", "#e68e11", "NYK.png"],
  "Grizzlies" : ["Memphis Grizzlies","MEM", "#123d53", "MG.png"],
  "76ers" : ["Philadelphia 76ers","PHI", "#e01251", "P7.png"],
  "Pelicans" : ["New Orleans Pelicans","NOP", "#459c80", "NOP.png"],
  "Raptors" : ["Toronto Raptors", "TOR", "#861634", "TR.png"],
  "Spurs" : ["San Antonio Spurs", "SAS", "#6c6c6c", "SAS.png"],
  "Bulls" : ["Chicago Bulls", "CHI", "#d91515", "CB.png"],
  "Nuggets" : ["Denver Nuggets", "DEN", "#eeb509", "DN.png"],
  "Cavaliers" : ["Cleveland Cavaliers", "CLE", "#c94955", "CC.png"],
  "Timberwolves" : ["Minnesota Timberwolves", "MIN", "#0d920a", "MT.png"],
  "Pistons" : ["Detroit Pistons", "DET", "#d74257", "DP.png"],
  "Thunder" : ["Oklahoma City Thunder", "OKC", "#15b5ea", "OKC.png"],
  "Pacers" : ["Indiana Pacers", "IND",  "#cfb650", "IP.png"],
  "Trail Blazers" : ["Portland Trail Blazers","POR", "#5d0f24", "PTB.png"],
  "Bucks" : ["Milwaukee Bucks", "MIL", "#0f5d12", "MB.png"],
  "Jazz" : ["Utah Jazz", "UTA", "#437f9b", "UJ.png"],
  "Hawks" : ["Atlanta Hawks", "ATL", "#772a2a", "AH.png"],
  "Warriors" : ["Golden State Warriors", "GSW", "#0145ad", "GSW.png"],
  "Hornets" : ["Charlotte Hornets", "CHA", "#204b69", "CH.png"],
  "Clippers" : ["Los Angeles Clippers","LAC", "#cd1ad4", "LAC.png"],
  "Heat" : ["Miami Heat", "MIA", "#c5002e", "MH.png"],
  "Lakers" : ["Los Angeles Lakers", "LAL", "#7d00c5", "LAL.png"],
  "Magic" : ["Orlando Magic", "ORL", "#1480f8", "OM.png"],
  "Suns" : ["Phoenix Suns", "PHX", "#f8a014", "PS.png"],
  "Wizards" : ["Washington Wizards", "WAS", "#1480f8", "WW.png"],
  "Kings" : ["Sacramento Kings", "SAC", "#480974", "SK.png"]
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

/* team_1 = away team
 * team_2 = home team
 */
s.getBoxscoreUrl = function(date, team_1, team_2) {
  var dateString = date.getFullYear();
  dateString += date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; 
  dateString += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  var url = s.BOXSCORE_BASE + dateString + "/" + team_1 + team_2 + s.BOXSCORE_END;
  return url;
}

s.parseGame = function(game_data) {
  var game = new Object();
  game.status = game_data.StateDetails;

  game.team_1_name = game_data.Away.Team.Name;
  game.team_1_code = teamData[game.team_1_name][1];
  game.team_1 = teamData[game.team_1_name][0]; // Full Name
  game.team_1_score = game_data.Away.Linescore.Score;
  game.team_1_colour = teamData[game.team_1_name][2];
  game.team_1_icon = chrome.extension.getURL("imgs/" + teamData[game.team_1_name][3]);

  game.team_2_name = game_data.Home.Team.Name;
  game.team_2_code = teamData[game.team_2_name][1];
  game.team_2 = teamData[game.team_2_name][0]; // Full name
  game.team_2_score = game_data.Home.Linescore.Score;
  game.team_2_colour = teamData[game.team_2_name][2];
  game.team_2_icon = chrome.extension.getURL("imgs/" + teamData[game.team_2_name][3]);

  game.boxscore = s.getBoxscoreUrl(new Date(game_data.Date), game.team_1_code, game.team_2_code);
  return game;
}

s.parseScoreboard = function(data) { 
  for (day in data) {
    var games = [];
    for (i in data[day]['Games']) {
      games.push(s.parseGame(data[day]['Games'][i]));
    }
    s.DATA.games[day] = games;
  }
}

s.getScoreBoard = function(callback) {
  s.make_request(s.SCOREBOARD_URL, {}, function(data) {
    s.parseScoreboard(data); 
    callback();
  });
}

/* Update current day's scores */
s.updateScoreboard = function(callback) {
  s.make_request(s.SCOREBOARD_URL, {}, function(data) {
    var games = [];
    for (i in data[1]['Games']) {
      games.push(s.parseGame(data[1]['Games'][i]));
    }
    s.DATA.games[1] = games;
    callback();
  });
}
