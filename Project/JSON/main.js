let app = angular.module('myApp', []);

app.controller('HeroController', ['$scope', '$http', function($scope, $http){
  let self = $scope; 
  $http.get('superheros.json').then(
    function(res){
      self.data = res.data
    },
    function(err){
      console.log(err)
    }
  )
}])