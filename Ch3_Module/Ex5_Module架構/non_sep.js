(function(){
  let app = angular.module('myApp', ['myController', 'myDirective', 'myFilter', 'myService']);
  
  let controller = angular.module('myController', []);
  let directive = angular.module('myDirective', []);
  let filter = angular.module('myFilter', []);
  let service = angular.module('myService', []);
})();