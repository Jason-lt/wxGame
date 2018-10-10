(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/double/game_world.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd3c58pTAlZIgqkP8Sp0sAmY', 'game_world', __filename);
// Script/double/game_world.js

"use strict";

// 整个游戏的数据，集中存放
double.GameWorld = {
    //游戏状态
    gameOver: true,
    gamePause: false,
    gameLevelUp: false,

    //游戏内信息
    totalLevel: 0,
    newestObjectIndex: 0,
    chipNumber: 0,
    totalScore: 0,
    levelObjectNumber: 0,
    levelObjectList: [],

    //当前关卡信息
    weaponType: 0, //0:枪,1:弓箭
    gunType: "",
    gunDamageBonus: 0,
    impactForce: 0,
    arrowType: "",
    arrowSpeed: 0,

    //当前击打对象信息
    objectType: "",
    objectBlood: 0,
    objectAccelerated: 0,
    objectInitializedSpeed: 0,

    //当前时间状态信息
    objectNowLocationX: 0,
    objectNowLocationY: 0,
    objectNowRotation: 0,
    gunRotationRight: 0,
    gunRotationLeft: 0,

    //游戏配置信息
    doubleObjectList: ["object0", "object1", "object2", "object3", "object4", "object5", "object6", "object7", "object8", "object9", "object10", "object11", "object12", "object13", "object14", "box"],
    doubleObjectNameList: ["靶子", "雪人", "相机", "仙人球", "汉堡包", "花瓶", "鼓", "乐高", "香蕉", "杯子", "胡萝卜", "闹钟", "皇冠", "电视机", "吉他", "宝箱"],
    doubleObjectAniPoolList: ["dajiChengPool", "dajiHongPool", "dajiHuangPool", "dajiLanPool", "dajiZongPool", "dajiChengPool", "dajiHongPool", "dajiHuangPool", "dajiLanPool", "dajiZongPool", "dajiChengPool", "dajiHongPool", "dajiHuangPool", "dajiLanPool", "dajiZongPool", "box"],

    doubleGunNameList: ["gun0", "gun1", "gun2", "gun3", "gun4", "gun5", "gun6", "gun7", "gun8", "gun9", "gun10", "gun11", "gun12", "gun13"],
    doubleBowNameList: ["bow0", "bow1", "bow2", "bow3", "bow4", "bow5", "bow6", "bow7", "bow8", "bow9", "bow10", "bow11", "bow12"],
    doubleArrowTypeList: ["arrow0", "arrow1", "arrow2", "arrow3", "arrow4", "arrow5", "arrow6", "arrow7", "arrow8", "arrow9", "arrow10", "arrow11", "arrow12"],

    "objectConfig": {
        "box": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 0,
            "bloodList": [16, 20, 8, 12]
        },
        "object0": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [8, 14, 3, 12]
        },
        "object1": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [14, 20, 5, 16]
        },
        "object2": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [18, 24, 6, 20]
        },
        "object3": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [16, 22, 4, 16]
        },
        "object4": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [16, 22, 4, 18]
        },
        "object5": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [6, 10, 3, 10]
        },
        "object6": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [20, 26, 14, 20]
        },
        "object7": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [18, 24]
        },
        "object8": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [10, 16]
        },
        "object9": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "bloodList": [8, 14]
        },
        "object10": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [14, 20]
        },
        "object11": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [18, 24]
        },
        "object12": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [14, 20]
        },
        "object13": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [20, 28]
        },
        "object14": {
            "accelerated": [40, 40, 40],
            "initializedSpeed": [300, 300, 300],
            "goldNumber": 50,
            "bloodList": [18, 24]
        }
    },
    "gunConfig": {
        "gun0": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun1": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun2": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun3": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun4": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun5": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun6": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun7": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun8": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun9": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun10": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun11": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun12": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "gun13": {
            "damageBonus": 1,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow0": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow1": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow2": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow3": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow4": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow5": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow6": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow7": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow8": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow9": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow10": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow11": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        },
        "bow12": {
            "damageBonus": 0.9,
            "impactForce": 100,
            "arrowInitializedSpeed": 2000
        }
    },
    "boxConfig": [{
        "minLevel": 6,
        "maxLevel": 50,
        "subAmount": 5,
        "probability": 0.9,
        "mostBoxNumber": 1,
        "minBoxChip": 30,
        "maxBoxChip": 60
    }, {
        "minLevel": 51,
        "maxLevel": 100,
        "subAmount": 5,
        "probability": 0.9,
        "mostBoxNumber": 1,
        "minBoxChip": 30,
        "maxBoxChip": 60
    }],
    "generalConfig": {
        "objectStageBottomProbability": 0.1,
        "objectStageMiddleProbability": 0.4,
        "objectStageTopProbability": 0.5,
        "objectStageBottomScale": 0.25,
        "objectStageMiddleScale": 0.5,
        "objectStageTopScale": 0.25,

        "gunUnlockChip": 250,
        "bowUnlockChip": 500,

        "stageOneLevel": 30,
        "stageTwoLevel": 100
    },

    // //过审配置
    // gunnerShareSchemeConfig : null,
    //分享配置
    shareConfig: null
};

double.windowNewWeaponType = {
    newObject: 1,
    newWeapon: 2,
    goldTreasureChest: 3,
    newResultRollOne: 4,
    newResultRollTwo: 5,
    newResultRollThree: 6
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=game_world.js.map
        