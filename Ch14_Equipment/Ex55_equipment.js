
(function () {
  let app = angular.module('app', []);

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

  app.controller('CharacterController', ['$scope', '$filter', 'localStorageService', function($scope, $filter, localStorageService){
    let self = $scope;
    let propertyName = "RoleList";
    self.isList = true;

    // 角色
    self.characters = localStorageService.getProperty(propertyName);
    // 角色編輯備份
    self.characterBack = {};
    self.characterInfo = function(character){
      // 編輯時先複製一份出來編輯
      self.characterBack = angular.copy(character);
      // 取消列表模式
      self.isList = false;
      self.tab = 1;
    };

    self.backToList = function(){
      // 清空編輯備份
      self.characterBack = {};
      // 列表模式
      self.isList = true;
    }

    self.save = function(){
      // 尋找相同 ID 進行修改
      (self.characters).forEach((value, key) => {
        if(value.id === self.characterBack.id){
          self.characters[key] = self.characterBack;
          localStorageService.setProperty(propertyName, self.characters);
          self.isList = true;
          return;
        }
      })
    }

    // 確認下一步是否可以進行
    self.checkNext = function(step){
      switch(step){
        case 1:
          // 判斷職業
          if(self.characterBack.job) 
            return true;
            break;
        case 2:
          // 判斷裝備
          if(self.characterBack.weapon && self.characterBack.armor) 
            return true;
            break;
        case 3:
          // 判斷技能
          if(self.characterBack.skill)
            return true;
            break;
      }
    };

    // TAB
    self.tab = 1;
    // 設定現在的 TAB
    self.setTab = function(tab) {
      self.tab = tab;
    };
    // 確認現在的 TAB
    self.isTab = function(tab) {
      return self.tab === tab
    }

    // job
    self.job = [
      {name: '戰士', key: 1, skill: 'warrior', weapon: 'sword', armor: 'heavy'},
      {name: '弓箭手', key: 2, skill: 'archer', weapon: 'bow', armor: 'medium'},
      {name: '幻術師', key: 3, skill: 'mesmer', weapon: 'scepter', armor: 'light'}
    ];

    // weapon
    self.weapon = [
      {name: '短劍', key: 1, class: 'sword', data: {min: 1, max: 3}},
      {name: '長劍', key: 2, class: 'sword', data: {min: 3, max: 5}},
      {name: '雙手劍', key: 3, class: 'sword', data: {min: 5, max: 10}},
      {name: '黃金劍', key: 4, class: 'sword', data: {min: 10, max: 20}},
      {name: '短弓', key: 5, class: 'bow', data: {min: 2, max: 3}},
      {name: '長弓', key: 6, class: 'bow', data: {min: 3, max: 4}},
      {name: '重弩弓', key: 7, class: 'bow', data: {min: 4, max: 5}},
      {name: '黃金弓', key: 8, class: 'bow', data: {min: 8, max: 13}},
      {name: '見習杖', key: 9, class: 'scepter', data: {min: 1, max: 3}},
      {name: '魔術杖', key: 10, class: 'scepter', data: {min: 3, max: 5}},
      {name: '火焰杖', key: 11, class: 'scepter', data: {min: 5, max: 7}},
      {name: '黃金杖', key: 12, class: 'scepter', data: {min: 7, max: 9}}
    ];
    // armor
    self.armor = [
      {name: '布袍', key: 1, class: 'light', data: {value: 20}},
      {name: '法袍', key: 2, class: 'light', data: {value: 30}},
      {name: '神聖法袍', key: 3, class: 'light', data: {value: 40}},
      {name: '布甲', key: 4, class: 'medium', data: {value: 40}},
      {name: '皮甲', key: 5, class: 'medium', data: {value: 50}},
      {name: '硬皮盔甲', key: 6, class: 'medium', data: {value: 60}},
      {name: '骨甲', key: 7, class: 'heavy', data: {value: 60}},
      {name: '鎖甲', key: 8, class: 'heavy', data: {value: 70}},
      {name: '鏈甲', key: 9, class: 'heavy', data: {value: 80}}
    ];

    // skill
    self.skill = [
      {name: '重砍', key: 1, class: 'warrior', data: {min: 50, max: 80}},
      {name: '穿刺射擊', key: 2, class: 'archer', data: {min: 30, max: 100}},
      {name: '心靈震盪', key: 3, class: 'mesmer', data: {min: 60, max: 70}}
    ];

    // 異動職業的時候移除裝備技能
    self.checkJob = function(){
      delete self.characterBack.weapon;
      delete self.characterBack.armor;
      delete self.characterBack.skill;
    };
    // 傳入職業、屬性欄位、回傳值
    self.checkItem = function(job, attr){
      let data = self.filterJob(job);
      if(data){
        return data[attr];
      } else {
        return null;
      }
    };
    // 篩選職業 KEY
    self.filterJob = function(job){
      job = $filter('filter')(self.job, {key: job}) || '';
      if(job.length > 0) {
        return job[0]
      } else {
        return null;
      }
    }


  }])
  
})();