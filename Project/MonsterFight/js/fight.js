
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

  app.filter('keyToName', ['$filter', function ($filter) {
    return function (key, array) {
      let data = $filter('filter')(array, { key: key });
      if (data.length > 0) {
        return data[0].name
      }
    }
  }])

  app.controller('GameController', ['$scope', '$filter', 'localStorageService', function ($scope, $filter, localStorageService) {
    let self = $scope;
    // 載入角色
    let propertyName = "RoleList";
    self.characters = localStorageService.getProperty(propertyName);
    // 選擇角色
    self.fighter = {};
    // 顯示是否為選擇的角色
    self.checked = function (character) {
      return self.fighter.id === character.id;
    };

    self.boss = { name: '魔王', hp: 10000, skill: 3, atk: { min: 80, max: 120 }, def: { value: 40 }, special: { min: 150, max: 250 } };
    // 備份魔王，重置時使用
    self.bossBack = angular.copy(self.boss);

    // 選擇角色計算能力值
    self.chooseFighter = function (character) {
      if (character.job) {
        self.fighter = angular.copy(character);
        // 血量
        self.fighter.hp = self.fighter.ability.vitality * 100;
        // 攻擊力
        let atk = $filter('filter')(self.weapon, { key: self.fighter.weapon })[0].data;
        self.fighter.atk = {}
        // 防禦力
        let def = $filter('filter')(self.armor, { key: self.fighter.armor })[0].data;
        self.fighter.def = def
        // 技能傷害
        let special = $filter('filter')(self.skill, { key: self.fighter.skill })[0].data;
        self.fighter.special = {};
        switch (self.fighter.job) {
          case 1:
            // 戰士
            self.fighter.atk.min = atk.min * self.fighter.ability.strength;
            self.fighter.atk.max = atk.max * self.fighter.ability.strength;
            self.fighter.special.min = special.min * self.fighter.ability.strength;
            self.fighter.special.max = special.max * self.fighter.ability.strength;
            break;
          case 2:
            // 弓箭手
            self.fighter.atk.min = atk.min * self.fighter.ability.agility;
            self.fighter.atk.max = atk.max * self.fighter.ability.agility;
            self.fighter.special.min = special.min * self.fighter.ability.agility;
            self.fighter.special.max = special.max * self.fighter.ability.agility;
            break;
          case 3:
            // 幻術師
            self.fighter.atk.min = atk.min * self.fighter.ability.wisdom;
            self.fighter.atk.max = atk.max * self.fighter.ability.wisdom;
            self.fighter.special.min = special.min * self.fighter.ability.wisdom;
            self.fighter.special.max = special.max * self.fighter.ability.wisdom;
            break;
        }
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
        if(isAttacked.hp - attack <= 0){
          isAttacked.hp = 0
        } else {
          isAttacked.hp -= attack
        };
      } else {
        // 特殊攻擊
        let attack = self.checkAtk(character.special, isAttacked);
        // 轉換技能名稱
        let skillName = $filter('keyToName')(character.skill, self.skill);
        self.fightText.push({
          text: name + " 使用 " + skillName + "，對 " + isAttacked.name + " 造成 " + attack + " 點傷害"
        });
        if(isAttacked.hp - attack <= 0){
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
      console.log(character)
      total = total - character.def.value;
      total = total > 0 ? total : 0;
      return total;
    };

    // job
    self.job = [
      { name: '戰士', key: 1, skill: 'warrior', weapon: 'sword', armor: 'heavy' },
      { name: '弓箭手', key: 2, skill: 'archer', weapon: 'bow', armor: 'medium' },
      { name: '幻術師', key: 3, skill: 'mesmer', weapon: 'scepter', armor: 'light' }
    ];

    // weapon
    self.weapon = [
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
    ];
    // armor
    self.armor = [
      { name: '布袍', key: 1, class: 'light', data: { value: 20 } },
      { name: '法袍', key: 2, class: 'light', data: { value: 30 } },
      { name: '神聖法袍', key: 3, class: 'light', data: { value: 40 } },
      { name: '布甲', key: 4, class: 'medium', data: { value: 40 } },
      { name: '皮甲', key: 5, class: 'medium', data: { value: 50 } },
      { name: '硬皮盔甲', key: 6, class: 'medium', data: { value: 60 } },
      { name: '骨甲', key: 7, class: 'heavy', data: { value: 60 } },
      { name: '鎖甲', key: 8, class: 'heavy', data: { value: 70 } },
      { name: '鏈甲', key: 9, class: 'heavy', data: { value: 80 } }
    ];

    // skill
    self.skill = [
      { name: '重砍', key: 1, class: 'warrior', data: { min: 50, max: 80 } },
      { name: '穿刺射擊', key: 2, class: 'archer', data: { min: 30, max: 100 } },
      { name: '心靈震盪', key: 3, class: 'mesmer', data: { min: 60, max: 70 } }
    ];
  }])
})();