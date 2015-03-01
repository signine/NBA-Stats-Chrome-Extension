StatsService = new Object(); 
var s = StatsService;
s.BASE_URL = 'http://nba-stats-si.herokuapp.com/v1'
s.ENDPOINTS = {'scoreboard': '/scoreboard', 'current_scores': '/scoreboard/current_scores'}

s.DATA = new Object();
s.DATA.games = {};

var teamData = 
{
  "BOS" : ["Boston Celtics", "BOS", "#01ad3a", "BC.png"],
  "DAL" : ["Dallas Mavericks", "DAL", "#10aef8", "DM.png"],
  "BKN" : ["Brooklyn Nets", "BKN", "#3d3d3d", "BN.png"],
  "HOU" : ["Houston Rockets","HOU", "#e62a11", "HR.png"],
  "NYK" : ["New York Knicks","NYK", "#e68e11", "NYK.png"],
  "MEM" : ["Memphis Grizzlies","MEM", "#123d53", "MG.png"],
  "PHI" : ["Philadelphia 76ers","PHI", "#e01251", "P7.png"],
  "NOP" : ["New Orleans Pelicans","NOP", "#459c80", "NOP.png"],
  "TOR" : ["Toronto Raptors", "TOR", "#861634", "TR.png"],
  "SAS" : ["San Antonio Spurs", "SAS", "#6c6c6c", "SAS.png"],
  "CHI" : ["Chicago Bulls", "CHI", "#d91515", "CB.png"],
  "DEN" : ["Denver Nuggets", "DEN", "#eeb509", "DN.png"],
  "CLE" : ["Cleveland Cavaliers", "CLE", "#c94955", "CC.png"],
  "MIN" : ["Minnesota Timberwolves", "MIN", "#0d920a", "MT.png"],
  "DET" : ["Detroit Pistons", "DET", "#d74257", "DP.png"],
  "OKC" : ["Oklahoma City Thunder", "OKC", "#15b5ea", "OKC.png"],
  "IND" : ["Indiana Pacers", "IND",  "#cfb650", "IP.png"],
  "POR" : ["Portland Trail Blazers","POR", "#5d0f24", "PTB.png"],
  "MIL" : ["Milwaukee Bucks", "MIL", "#0f5d12", "MB.png"],
  "UTA" : ["Utah Jazz", "UTA", "#437f9b", "UJ.png"],
  "ATL" : ["Atlanta Hawks", "ATL", "#772a2a", "AH.png"],
  "GSW" : ["Golden State Warriors", "GSW", "#0145ad", "GSW.png"],
  "CHA" : ["Charlotte Hornets", "CHA", "#204b69", "CH.png"],
  "LAC" : ["Los Angeles Clippers","LAC", "#cd1ad4", "LAC.png"],
  "MIA" : ["Miami Heat", "MIA", "#c5002e", "MH.png"],
  "LAL" : ["Los Angeles Lakers", "LAL", "#7d00c5", "LAL.png"],
  "ORL" : ["Orlando Magic", "ORL", "#1480f8", "OM.png"],
  "PHX" : ["Phoenix Suns", "PHX", "#f8a014", "PS.png"],
  "WAS" : ["Washington Wizards", "WAS", "#1480f8", "WW.png"],
  "SAC" : ["Sacramento Kings", "SAC", "#480974", "SK.png"]
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

s.format_date = function(date) {
  var date_string = "";
  date_string += (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  date_string += "/" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
  date_string += "/" + date.getFullYear();
  return date_string;
}

s.process_game = function(game) {
  game["team_1_name"] = teamData[game["team_1"]][0]; // Full name
  game["team_1_icon"] = chrome.extension.getURL("imgs/" + teamData[game['team_1']][3]);
  game["team_1_colour"] = teamData[game["team_1"]][2];

  game["team_2_name"] = teamData[game["team_2"]][0]; // Full name
  game["team_2_icon"] = chrome.extension.getURL("imgs/" + teamData[game['team_2']][3]);
  game["team_2_colour"] = teamData[game["team_2"]][2]; 
}

s.getScoreBoard = function(dates, callback) {
  var qdates = []
  for (d in dates) {
    if (!s.DATA.games[dates[d]]) { qdates.push(dates[d]); }
  }

  if (qdates.length == 0) {
    callback();
    return;
  }

  var url = s.BASE_URL + s.ENDPOINTS['scoreboard'];
  var date_formatted = [];
  for (d in qdates) { date_formatted.push(s.format_date(qdates[d])); }
  date_formatted = JSON.stringify(date_formatted);

  s.make_request(url, {dates: date_formatted}, function(data) {
    for (d in data['scoreboard']) {
      for (g in data['scoreboard'][d]) {
        s.process_game(data['scoreboard'][d][g]);
      }
      s.DATA.games[dates[d]] = data['scoreboard'][d];
    }
    callback();
  });
}

/* Update current day's scores */
s.updateCurrentScores = function(callback) {
  var url = s.BASE_URL + s.ENDPOINTS['current_scores'];
  var today = s.format_date(new Date());
  s.make_request(s.SCOREBOARD_URL, {}, function(data) {
    s.DATA.games[today] = data['current_scores'];

    callback();
  });
}
