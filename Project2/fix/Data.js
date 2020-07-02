let app = angular.module('myApp', []);

app.controller('DataController', ['$scope', '$http', function ($scope, $http) {
  let self = $scope;
  self.data = [];
  getAPI();
  // API 串接整理
  self.Del = function (index) {
    //傳index
    self.data.splice(index, 1);
  }
  self.getData = function () {
    getAPI();
  };

  function getAPI() {
    $http.get('https://next.json-generator.com/api/json/get/4ymOIaXA_').then(
      function (res) {
        res.data.forEach(el => {
          if (el.age > 30) { self.data.push(el) }
        })
      },
      function (err) {
        console.log(err)
      }
    )
  }
}]);