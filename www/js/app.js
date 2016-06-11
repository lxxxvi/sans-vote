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
  $scope.getPoll = function(id) {
    console.log("getpoll called");
    $http.get('http://extensive.ch/vote-api/getpoll/'+id).success(function(data) {
        $scope.poll =  data["polls"][0];
    });

    $http.get('http://extensive.ch/vote-api/getpollresult/'+id).success(function(data) {
      console.log("getpoll result");
      console.log(data);

          if(data.total > 0) {
              $scope.poll.totalvotes = data.total;
              $scope.pieChart = {
                labels: ['Ja', 'Nein'],
                data: [ data.pro, data.contra ],     // TODO: set current results
                colours: [ '#0071bc', '#add2eb' ]
              }
          }
          else {
            $scope.poll.totalvotes = 0;
          }
          $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
          $http.post("http://extensive.ch/vote-api/getvote", {"uuid":"Web-User", "poll_id": id})
          .success(function(data, status, headers, config) {
              console.log(data);
              console.log("gotvote");
              $scope.getVote(data.votetype);
          }).error(function(data, status, headers, config) {
              $scope.status = status;
          });
    });
  }

  $scope.getVote = function(vote) {
    if(vote == "0"){
      $scope.vote = 'No';
    }
    else if(vote == "1"){
      $scope.vote = 'Yes';
    }
    else {
        $scope.vote = '';
    }
  }

  $scope.setVote = function(value) {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http.post("http://extensive.ch/vote-api/setvote", {"uuid":"Web-User", "poll_id": $scope.poll.poll_id, "vote_type": value})
    .success(function(data, status, headers, config) {
        console.log(data);
        $scope.getPoll($scope.poll.poll_id);
    }).error(function(data, status, headers, config) {
        $scope.status = status;
        console.log(status);
    });
  }

  $scope.getPoll($stateParams.pollId);
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
