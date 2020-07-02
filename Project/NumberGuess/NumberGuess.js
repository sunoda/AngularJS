(function () {
  let app = angular.module('myApp', []);

  app.controller('NumberController', ['$scope', function ($scope) {
    $scope.guesses = {min: 0, max: 100};
    $scope.guess = ''
    $scope.bingo = false;
    $scope.error = false;
    $scope.between = false;
    $scope.number = Math.floor((Math.random()*100)+1);
    $scope.range = [100, 500, 1000];

    $scope.setRange = function(){
      $scope.bingo = false;
      $scope.error = false;
      $scope.between =false;
      $scope.guesses.min = 0;
      $scope.guesses.max = $scope.rangeCheck;
      $scope.number = Math.floor((Math.random()*($scope.guesses.max) + 1));
    }

    $scope.submit = function () {
      if($scope.guess === $scope.number){
        $scope.error = false;
        $scope.bingo = true;
      } else if( $scope.guess < $scope.guesses.max && $scope.guess > $scope.number ){
        $scope.error = false;
        $scope.guesses.max = $scope.guess
        if($scope.guesses.max - $scope.guesses.min == 2){
          $scope.between = true;
        }
      } else if($scope.guess > $scope.guesses.min && $scope.guess < $scope.number){
        $scope.error = false;
        $scope.guesses.min = $scope.guess
        if($scope.guesses.max - $scope.guesses.min == 2){
          $scope.between = true;
        }
      } else {
        $scope.error = true;
      }
    }
  }])
})();