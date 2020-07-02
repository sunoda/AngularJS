let app = angular.module('myApp', []);


app.filter('NameFilter', function(){
  return function(Name){
    return Name.last + ' ' + Name.first
  }
})

app.filter('FriendFilter', function(){
  return function(Friend){
    
    return (Friend.id + 1)+ '. ' + Friend.name
  }
})

app.filter('Age', function(item){
  
  return item.age < 30
})

app.controller('DataController', ['$scope','$http', function($scope, $http){
  let self = $scope;
  self.url = 'https://next.json-generator.com/api/json/get/4ymOIaXA_';

  // API 串接整理
  $http({
    method: 'GET',
    url :self.url
  }).then(function(res){
    self.data = res.data

  }, function(err){
    console.log(err);
  })

  self.DelHandler = function(item){
    //傳index
    self.data.splice(self.data.indexOf(item), 1);
  }

  self.AgeFilter = function(item){
    // 在畫面操作資料會有效能問題
    console.log(item)
    return item.age > 30
  }

  self.getData = function(){
    $http({
      method: 'GET',
      url :self.url
    }).then(function(res){
      console.log(self.data);
      res.data.forEach(el =>{
        self.data.push(el);
      })
    }, function(err){
      console.log(err);
    })
  }
}]);