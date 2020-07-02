
(function () {

  app.service('localStorageService', function () {
    let self = this;
    self.getProperty = function (propertyName) {
      let result = localStorage.getItem(propertyName);
      result = result || "[]";
      return angular.fromJson(result);
    };

    self.setProperty = function (propertyName, value) {
      localStorage.setItem(propertyName, angular.toJson(value));
    }
  });

  app.controller('RoleController', ['$scope', 'localStorageService', function ($scope, localStorageService) {
    let self = $scope;
    let propertyName = "RoleList";
    self.object = {};
    self.object.isList = true;
    self.object.dataList = localStorageService.getProperty(propertyName);
    self.object.editData = {};
    // 新增
    self.goNew = function (init) {
      self.object.isList = false;
      self.object.editData = {};
      init();
    };
    // 編輯
    self.goEdit = function (item, init) {
      self.object.isList = false;
      self.object.editData = angular.copy(item);
      init(item.ability);
    };
    // 刪除
    self.delete = function (item) {
      if (confirm('是否確認刪除 ?')) {
        self.object.dataList.splice(self.object.dataList.indexOf(item), 1);
        localStorageService.setProperty(propertyName, self.object.dataList);
      }
    };
    // 確認
    self.submit = function (ability) {
      // 複製編輯的物件
      let copy = angular.copy(self.object.editData);
      copy.ability = ability;
      // 判斷是否有 ID 值，有 ID 值代表是修改的，新增時 ID 為空
      if (copy.id) {
        angular.forEach(self.object.dataList, function (value, key) {
          if (value.id === copy.id) {
            self.object.dataList[key] = copy;
          };
        });
      } else {
        // 新增時加入新的 ID 值
        let now = new Date();
        copy.id = (now).getTime();
        copy.createdTime = now;
        self.object.dataList.push(copy);
      }
      self.object.isList = true;
      self.object.editData = {};
      // 將結果寫入 localStorage
      localStorageService.setProperty(propertyName, self.object.dataList);

    };
    // 返回
    self.backList = function () {
      self.object.isList = true;
      self.object.editData = {};
    }
    // 確認是否可以儲存
    self.checkForm = function (checkAbilitySet) {
      if (!self.object.editData.name) return false;
      return checkAbilitySet();
    };
  }])

  app.controller('AbilityController', ['$scope', function ($scope) {
    let self = $scope;
    self.maxAbility = 50;
    self.ability = {
      strength: 0,
      vitality: 0,
      agility: 0,
      wisdom: 0
    };
    // 預設腳色
    self.init = function (value) {
      value = value || {};
      self.maxAbility = 50;
      self.ability = {
        strength: value.strength || 0,
        vitality: value.vitality || 0,
        agility: value.agility || 0,
        wisdom: value.wisdom || 0
      };
      self.maxAbility -= self.ability.strength;
      self.maxAbility -= self.ability.vitality;
      self.maxAbility -= self.ability.agility;
      self.maxAbility -= self.ability.wisdom;
    };
    // 增加能力點數
    self.plus = function (propertyName) {
      if (self.maxAbility > 0) {
        self.ability[propertyName]++
        self.maxAbility--;
      }
    }
    // 減少能力點數
    self.minus = function (propertyName) {
      if (self.ability[propertyName] > 0) {
        self.ability[propertyName]--;
        self.maxAbility++;
      }
    };
    // 確認能力點數是否使用完畢
    self.checkAbilitySet = function () {
      if (self.maxAbility > 0) return false;

      return true
    };
  }])
})();