// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('PollsCtrl', function($scope, $http) {

  // Get futurePolls
  $http.get('http://extensive.ch/vote-api/getfuturepolls').success(function(data) {
    $scope.futurePolls = data["polls"];
  });

  $http.get('http://extensive.ch/vote-api/getpastpolls').success(function(data) {
    $scope.pastPolls = data["polls"];
  });

})

.controller('PollCtrl', function($scope, $stateParams, $http) {

console.log($stateParams);
  $http.get('http://extensive.ch/vote-api/getpoll/'+$stateParams.pollId).success(function(data) {
  $scope.poll =  data["polls"][0];
});

$http.get('http://extensive.ch/vote-api/getpollresult/'+$stateParams.pollId).success(function(data) {
if(data.total > 0) {
    $scope.pieChart = {
      labels: ['Ja', 'Nein'],
      data: [ data.pro, data.contra ],     // TODO: set current results
      colours: [ '#0071bc', '#add2eb' ]
    }
  }
});
$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
$http.post("http://extensive.ch/vote-api/getvote", {"uuid":"Web-User", "poll_id": $stateParams.pollId})
.success(function(data, status, headers, config) {
    console.log(data);
    $scope.status = data;

}).error(function(data, status, headers, config) {
    $scope.status = status;
});

$scope.setvote = function() {
  if($scope.status == "no result"){
    $scope.vote = '';
  }
  else if($scope.status == "0"){
    $scope.vote = 'No';
  }
  else if($scope.status == "1"){
    $scope.vote = 'Yes';
  }
}


})

.config(function($stateProvider, $urlRouterProvider,  $ionicConfigProvider) {
  $stateProvider

  .state('polls', {
    url: '/polls',
    templateUrl: 'templates/polls.html',
    controller: 'PollsCtrl'
  })

  .state('poll', {
    url: '/poll/:pollId',
    templateUrl: 'templates/poll.html',
    controller: 'PollCtrl'
  })

  $urlRouterProvider.otherwise('/polls');

})
