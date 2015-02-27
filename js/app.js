var app = angular.module('NBA', ['ngRoute', 'Controllers'])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)+ '|chrome-extension:'+currentImgSrcSanitizationWhitelist.toString().slice(-1);
        //console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);

    }
]);

app.config(['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        otherwise({
          templateUrl: 'scoreboard.html',
          controller: 'ScoreBoardCtrl'
        });
    }]);

