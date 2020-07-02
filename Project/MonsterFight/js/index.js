(function () {
  let app = angular.module('myApp', ['ngRoute']);
  //ngRoute
  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'role.html'
    });
    $routeProvider.when('/role', {
      templateUrl: 'role.html'
    });
    $routeProvider.when('/equipment', {
      templateUrl: 'equipment.html'
    });
    $routeProvider.when('/fight', {
      templateUrl: 'fight.html'
    });
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }])

  // LocalStorage
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

  //Create Role
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

  app.controller('AbilityController', ['$scope', '$timeout', '$interval', function ($scope, $timeout, $interval) {
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
    // 增加能力點數，長按持續增加
    self.plus = function (propertyName) {
      if (self.maxAbility > 0) {
        self.ability[propertyName]++
        self.maxAbility--;
      }
    }
    self.increase = function (propertyName) {
      self.plus(propertyName);
      timeout = $timeout(() => {
        interval = $interval(() => {
          self.plus(propertyName);
        }, 100)
      }, 500)
    }
    // 減少能力點數，長按持續減少
    self.minus = function (propertyName) {
      if (self.ability[propertyName] > 0) {
        self.ability[propertyName]--;
        self.maxAbility++;
      }
    };
    self.decrease = function (propertyName) {
      self.plus(propertyName);
      timeout = $timeout(() => {
        interval = $interval(() => {
          self.minus(propertyName);
        }, 100)
      }, 500)
    }
    //解除長按
    self.mouseUp = function () {
      $timeout.cancel(timeout);
      $interval.cancel(interval);
    }
    // 確認能力點數是否使用完畢
    self.checkAbilitySet = function () {
      if (self.maxAbility > 0) return false;

      return true
    };
  }])

  app.factory('EquipmentFactory', function () {
    return {
      // job
      job: [
        { name: '尚未設定職業', key: 0, skill: 'undefined', weapon: 'undefined', armor: 'undefined'},
        { name: '戰士', key: 1, skill: 'warrior', weapon: 'sword', armor: 'heavy' },
        { name: '弓箭手', key: 2, skill: 'archer', weapon: 'bow', armor: 'medium' },
        { name: '幻術師', key: 3, skill: 'mesmer', weapon: 'scepter', armor: 'light' }
      ],

      // weapon
      weapon: [
        { name: '未選擇', key: 0, class: 'undefined', data: { min: 0, max: 0 } },
        { name: '短劍', key: 1, class: 'sword', data: { min: 1, max: 3 } },
        { name: '長劍', key: 2, class: 'sword', data: { min: 3, max: 5 } },
        { name: '雙手劍', key: 3, class: 'sword', data: { min: 5, max: 10 } },
        { name: '黃金劍', key: 4, class: 'sword', data: { min: 10, max: 20 } },
        { name: '短弓', key: 5, class: 'bow', data: { min: 2, max: 3 } },
        { name: '長弓', key: 6, class: 'bow', data: { min: 3, max: 4 } },
        { name: '重弩弓', key: 7, class: 'bow', data: { min: 4, max: 5 } },
        { name: '黃金弓', key: 8, class: 'bow', data: { min: 8, max: 13 } },
        { name: '見習杖', key: 9, class: 'scepter', data: { min: 1, max: 3 } },
        { name: '魔術杖', key: 10, class: 'scepter', data: { min: 3, max: 5 } },
        { name: '火焰杖', key: 11, class: 'scepter', data: { min: 5, max: 7 } },
        { name: '黃金杖', key: 12, class: 'scepter', data: { min: 7, max: 9 } }
      ],
      // armor
      armor: [
        { name: '未選擇', key: 0, class: 'undefined', data: { value: 0 } },
        { name: '布袍', key: 1, class: 'light', data: { value: 20 } },
        { name: '法袍', key: 2, class: 'light', data: { value: 30 } },
        { name: '神聖法袍', key: 3, class: 'light', data: { value: 40 } },
        { name: '布甲', key: 4, class: 'medium', data: { value: 40 } },
        { name: '皮甲', key: 5, class: 'medium', data: { value: 50 } },
        { name: '硬皮盔甲', key: 6, class: 'medium', data: { value: 60 } },
        { name: '骨甲', key: 7, class: 'heavy', data: { value: 60 } },
        { name: '鎖甲', key: 8, class: 'heavy', data: { value: 70 } },
        { name: '鏈甲', key: 9, class: 'heavy', data: { value: 80 } }
      ],

      // skill
      skill: [
        { name: '未選擇', key: 0, class: 'undefined', data: { min: 0, max: 0 } },
        { name: '重砍', key: 1, class: 'warrior', data: { min: 50, max: 80 } },
        { name: '穿刺射擊', key: 2, class: 'archer', data: { min: 30, max: 100 } },
        { name: '心靈震盪', key: 3, class: 'mesmer', data: { min: 60, max: 70 } }
      ]
    }
  })

  //Equipment
  app.controller('CharacterController', ['$scope', '$filter', 'localStorageService', 'EquipmentFactory', function ($scope, $filter, localStorageService, EquipmentFactory) {
    let self = $scope;
    let propertyName = "RoleList";
    self.isList = true;
    self.Eq = EquipmentFactory;
    console.log(self.Eq);
    // 角色
    self.characters = localStorageService.getProperty(propertyName);
    // 角色編輯備份
    self.characterBack = {};
    self.characterInfo = function (character) {
      // 編輯時先複製一份出來編輯
      self.characterBack = angular.copy(character);
      // 取消列表模式
      self.isList = false;
      self.tab = 1;
    };
    self.backToList = function () {
      // 清空編輯備份
      self.characterBack = {};
      // 列表模式
      self.isList = true;
    }
    self.save = function () {
      // 尋找相同 ID 進行修改
      (self.characters).forEach((value, key) => {
        if (value.id === self.characterBack.id) {
          self.characters[key] = self.characterBack;
          localStorageService.setProperty(propertyName, self.characters);
          self.isList = true;
          return;
        }
      })
    }
    // 確認下一步是否可以進行
    self.checkNext = function (step) {
      switch (step) {
        case 1:
          // 判斷職業
          if (self.characterBack.job)
            return true;
          break;
        case 2:
          // 判斷裝備
          if (self.characterBack.weapon && self.characterBack.armor)
            return true;
          break;
        case 3:
          // 判斷技能
          if (self.characterBack.skill)
            return true;
          break;
      }
    };
    // TAB
    self.tab = 1;
    // 設定現在的 TAB
    self.setTab = function (tab) {
      self.tab = tab;
    };
    // 確認現在的 TAB
    self.isTab = function (tab) {
      return self.tab === tab
    }
    // 異動職業的時候移除裝備技能
    self.checkJob = function () {
      delete self.characterBack.weapon;
      delete self.characterBack.armor;
      delete self.characterBack.skill;
    };
    // 傳入職業、屬性欄位、回傳值
    self.checkItem = function (job, attr) {
      let data = self.filterJob(job);
      if (data) {
        return data[attr];
      } else {
        return null;
      }
    };
    // 篩選職業 KEY
    self.filterJob = function (job) {
      job = $filter('filter')(self.Eq.job, { key: job }) || '';
      if (job.length > 0) {
        return job[0]
      } else {
        return null;
      }
    }
  }])
  //Fight
  app.filter('keyToName', ['$filter', function ($filter) {
    return function (key, array) {
      let data = $filter('filter')(array, { key: key });
      if (data.length > 0) {
        return data[0].name
      }
    }
  }])

  app.controller('GameController', ['$scope', '$filter', 'localStorageService', 'EquipmentFactory', function ($scope, $filter, localStorageService, EquipmentFactory) {
    let self = $scope;
    self.Eq = EquipmentFactory;
    // 載入角色
    let propertyName = "RoleList";
    self.characters = localStorageService.getProperty(propertyName);
    // 選擇角色
    self.fighter = {};

    // 顯示是否為選擇的角色
    self.checked = function (character) {
      return self.fighter.id === character.id;
    };

    self.boss = {
      name: '魔王',
      hp: 10000,
      skill: 3,
      atk: { min: 80, max: 120 },
      def: { value: 40 },
      special: { min: 150, max: 250 }
    };
    // 備份魔王，重置時使用
    self.bossBack = angular.copy(self.boss);


    // 腳色能力值
    self.characters.forEach(character => {
      console.log(character)
      if(character.job){
        // 血量
        character.hp = character.ability.vitality * 100 || 100;
        // 攻擊力
        let atk = $filter('filter')(self.Eq.weapon, { key: character.weapon })[0].data;
        character.atk = {}
        // 防禦力
        let def = $filter('filter')(self.Eq.armor, { key: character.armor })[0].data;
        character.def = def
        // 技能傷害
        let special = $filter('filter')(self.Eq.skill, { key: character.skill })[0].data;
        character.special = {};
        switch (character.job) {
          case 1:
            // 戰士
            character.atk.min = atk.min * character.ability.strength;
            character.atk.max = atk.max * character.ability.strength;
            character.special.min = special.min * character.ability.strength;
            character.special.max = special.max * character.ability.strength;
            break;
          case 2:
            // 弓箭手
            character.atk.min = atk.min * character.ability.agility;
            character.atk.max = atk.max * character.ability.agility;
            character.special.min = special.min * character.ability.agility;
            character.special.max = special.max * character.ability.agility;
            break;
          case 3:
            // 幻術師
            character.atk.min = atk.min * character.ability.wisdom;
            character.atk.max = atk.max * character.ability.wisdom;
            character.special.min = special.min * character.ability.wisdom;
            character.special.max = special.max * character.ability.wisdom;
            break;
        } 
      } 
    })
    // 選擇角色計算能力值
    self.chooseFighter = function (character) {
      if (character.job) {
        self.fighter = angular.copy(character);
      } else {
        alert('尚未設定職業')
      }
    };

    // 對戰中
    self.isBattle = false;
    self.battle = function () {
      // 有 ID 就是有選角色
      if (self.fighter.id) {
        self.isBattle = true;
        // 清空對戰訊息
        self.fightText = [];
      } else {
        alert('請選擇角色');
      }
    };

    self.fightText = [];
    // 有人死亡
    self.isDead = false;
    // 攻擊計算
    self.fight = function (atk, character) {
      let name = character.name;
      let isAttacked = self.fighter;
      if (character.id)
        isAttacked = self.boss;
      if (atk === 0) {
        // 普通攻擊
        let attack = self.checkAtk(character.atk, isAttacked);
        self.fightText.push({
          text: name + " 使用: 普通攻擊，對 " + isAttacked.name + " 造成 " + attack + " 點傷害"
        });
        if (isAttacked.hp - attack <= 0) {
          isAttacked.hp = 0
        } else {
          isAttacked.hp -= attack
        };
      } else {
        // 特殊攻擊
        let attack = self.checkAtk(character.special, isAttacked);
        // 轉換技能名稱
        let skillName = $filter('keyToName')(character.skill, self.Eq.skill);
        self.fightText.push({
          text: name + " 使用 " + skillName + "，對 " + isAttacked.name + " 造成 " + attack + " 點傷害"
        });
        if (isAttacked.hp - attack <= 0) {
          isAttacked.hp = 0
        } else {
          isAttacked.hp -= attack
        };
      }
      if (character.id)
        self.checkBoss();
      else
        self.checkFighter();
    };
    // 重置對戰
    self.reFight = function () {
      self.isBattle = false;
      self.isDead = false;
      self.boss = angular.copy(self.bossBack);
      self.fighter = {};
    };

    self.checkBoss = function () {
      if (self.boss.hp > 0) {
        // 魔王還有 HP 就回擊
        self.fight(Math.floor(Math.random() * 2), self.boss);
      } else {
        self.fightText.push({ text: '魔王被擊倒' });
        self.isDead = true;
      }
    };

    self.checkFighter = function () {
      if (self.fighter.hp <= 0) {
        self.isDead = true;
      }
    }
    // 轉換傷害
    self.checkAtk = function (atk, character) {
      let random = Math.floor(Math.random() * (atk.max - atk.min + 1));
      let total = atk.max - random;
      total = total - character.def.value;
      total = total > 0 ? total : 0;
      return total;
    };
  }])
})();