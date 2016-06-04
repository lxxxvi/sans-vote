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

.controller('PollsCtrl', function($scope) {

  // TODO: load pools
  $scope.futurePolls = [
    { id: 1, title: 'Poll 1' },
    { id: 2, title: 'Poll 2' },
    { id: 3, title: 'Poll 3' },
    { id: 4, title: 'Poll 4' }
  ];
  $scope.pastPolls = [
    { id: 5, title: 'Poll 5' },
    { id: 6, title: 'Poll 6' },
    { id: 7, title: 'Poll 7' },
    { id: 8, title: 'Poll 8' }
  ];
})

.controller('PollCtrl', function($scope, $stateParams) {

  $scope.poll = {
    id: $stateParams.pollId,
    title: 'Poll',        // TODO: load title of poll
    description: 'Details zur Abstimmung'  // TODO: load text for poll
  };

  $scope.pieChart = {
    labels: ['Ja', 'Nein'],
    data: [ 58, 42 ],     // TODO: set current results
    colours: [ '#0071bc', '#add2eb' ]
  }

  $scope.vote = 'Yes';  // TODO: set 'Yes', 'No' or '' ('' means not voted yet)

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
