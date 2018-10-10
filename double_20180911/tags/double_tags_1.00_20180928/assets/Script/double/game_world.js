// 整个游戏的数据，集中存放
double.GameWorld = {

    //测试信息
    testObject : null,
    //游戏状态
    gameOver : true,
    gamePause : false,
    gameLevelUp : false,

    //游戏内信息(本地存储)
    totalLevel : 0,
    newestObjectIndex : 0,
    chipNumber : 0,
    weaponUnlockState : null,
    weaponNow : "",
    //游戏内信息(实时)
    totalScore : 0,
    levelObjectNumber : 0,
    levelObjectList : [],

    //当前关卡信息
    weaponType : 0,//0:枪,1:弓箭
    gunType : "",
    gunDamageBonus : 0,
    impactForce : 0,
    arrowType : "",
    arrowSpeed : 0,

    //当前击打对象信息
    objectType : "",
    objectBlood : 0,
    objectAccelerated : 0,
    objectHAccelerated : 0,
    objectInitializedSpeed : 0,

    //当前时间状态信息
    objectNowLocationX : 0,
    objectNowLocationY : 0,
    objectNowRotation : 0,
    gunRotationRight : 0,
    gunRotationLeft : 0,


    //游戏配置信息
    doubleObjectList : ["object0","object1","object2","object3","object4","object5","object6","object7","object8","object9","object10","object11","object12","object13","object14","box"],
    doubleObjectNameList : ["靶子","雪糕","相机","仙人球","汉堡包","花瓶","鼓","乐高","香蕉","杯子","胡萝卜","闹钟","皇冠","电视机","吉他","宝箱"],
    doubleObjectAniPoolList : ["dajiHongPool","dajiZongPool","dajiLanPool","dajiZongPool","dajiZongPool",
        "dajiHuangPool","dajiChengPool","dajiHongPool","dajiHuangPool","dajiLanPool",
        "dajiChengPool","dajiHuangPool","dajiHuangPool","dajiZongPool","dajiZongPool","dajiHongPool"],

    doubleGunNameList : ["gun0","gun1","gun2","gun3","gun4","gun5","gun6","gun7","gun8","gun9","gun10","gun11","gun12","gun13"],
    doubleBowNameList : ["bow0","bow1","bow2","bow3","bow4","bow5","bow6","bow7","bow8","bow9","bow10","bow11","bow12"],
    doubleRewardWeaponList :["gun9","gun10","gun11","gun12","gun13","bow9","bow10","bow11","bow12"],
    doubleArrowTypeList : ["arrow0","arrow1","arrow2","arrow3","arrow4","arrow5","arrow6","arrow7","arrow8","arrow9","arrow10","arrow11","arrow12"],

    "objectConfig": {
        "box": {
            "accelerated": [2400,2400,2400],
            "hAaccelerated": [300,250,250],
            "initializedSpeed": [2100,2100,2100],
            "goldNumber": 0,
            "bloodList": [16, 20, 8, 12]
        },
        "object0": {
            "accelerated": [1800,2000,2000],
            "hAaccelerated": [250,100,100],
            "initializedSpeed": [1800,2000,1800],
            "goldNumber": 1,
            "bloodList": [8, 14, 3, 12]
        },
        "object1": {
            "accelerated": [1800,2000,2000],
            "hAaccelerated": [220,100,100],
            "initializedSpeed": [1800,2000,2000],
            "goldNumber": 1,
            "bloodList": [14, 20, 5, 16]
        },
        "object2": {
            "accelerated": [2000,2400,2400],
            "hAaccelerated": [350,180,180],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 2,
            "bloodList": [18, 24, 6, 20]
        },
        "object3": {
            "accelerated": [2000,2400,2400],
            "hAaccelerated": [350,180,180],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 2,
            "bloodList": [16, 22, 7, 16]
        },
        "object4": {
            "accelerated": [1900,2400,2400],
            "hAaccelerated": [350,180,180],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 3,
            "bloodList": [16, 22, 7, 18]
        },
        "object5": {
            "accelerated": [1800,2000,2000],
            "hAaccelerated": [220,100,100],
            "initializedSpeed": [1800,2000,2000],
            "goldNumber": 2,
            "bloodList": [6, 10, 6, 10]
        },
        "object6": {
            "accelerated": [2300,2400,2400],
            "hAaccelerated": [450,250,250],
            "initializedSpeed": [2000,2000,2000],
            "goldNumber": 5,
            "bloodList": [20, 26, 14, 20]
        },
        "object7": {
            "accelerated": [1900,2100,2100],
            "hAaccelerated": [250,150,150],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 3,
            "bloodList": [18, 24, 14, 20]
        },
        "object8": {
            "accelerated": [1900,2100,2100],
            "hAaccelerated": [250,150,150],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 2,
            "bloodList": [10, 16, 8, 14]
        },
        "object9": {
            "accelerated": [1800,2000,2000],
            "hAaccelerated": [150,100,100],
            "initializedSpeed": [1900,2000,2000],
            "goldNumber": 5,
            "bloodList": [8, 14, 4, 12]
        },
        "object10": {
            "accelerated": [2000,2100,2100],
            "hAaccelerated": [200,100,100],
            "initializedSpeed": [2000,2100,2100],
            "goldNumber": 3,
            "bloodList": [14, 20, 10, 14]
        },
        "object11": {
            "accelerated": [2200,2200,2200],
            "hAaccelerated": [300,200,200],
            "initializedSpeed": [2000,2000,2000],
            "goldNumber": 3,
            "bloodList": [18, 24, 14, 20]
        },
        "object12": {
            "accelerated": [2100,2100,2100],
            "hAaccelerated": [250,150,150],
            "initializedSpeed": [2000,2000,2000],
            "goldNumber": 5,
            "bloodList": [14, 20, 10, 16]
        },
        "object13": {
            "accelerated": [2600,2600,2600],
            "hAaccelerated": [600,500,500],
            "initializedSpeed": [2200,2200,2200],
            "goldNumber": 7,
            "bloodList": [20, 28, 16, 24]
        },
        "object14": {
            "accelerated": [2400,2400,2400],
            "hAaccelerated": [450,350,350],
            "initializedSpeed": [2100,2100,2100],
            "goldNumber": 5,
            "bloodList": [18, 24, 14, 20]
        }
    },
    "gunConfig": {
        "gun0": {
            "damageBonus": 1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun1": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun2": {
            "damageBonus": 1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun3": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun4": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun5": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun6": {
            "damageBonus":1.2,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun7": {
            "damageBonus":1.2,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun8": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun9": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun10": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun11": {
            "damageBonus":1,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun12": {
            "damageBonus":1.2,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "gun13": {
            "damageBonus":1.2,
            "impactForce": 400,
            "arrowInitializedSpeed": 3500
        },
        "bow0": {
            "damageBonus": 0.9,
            "impactForce": 400,
            "arrowInitializedSpeed": 3000
        },
        "bow1": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow2": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow3": {
            "damageBonus": 1.2,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow4": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow5": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow6": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow7": {
            "damageBonus": 1.2,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow8": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow9": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow10": {
            "damageBonus": 1.2,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow11": {
            "damageBonus": 0.9,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        },
        "bow12": {
            "damageBonus": 1.2,
            "impactForce": 300,
            "arrowInitializedSpeed": 3000
        }
    },
    "boxConfig": [{
        "minLevel": 6,
        "maxLevel": 20,
        "subAmount": 5,
        "probability": 0.8,
        "mostBoxNumber": 2,
        "minBoxChip": 20,
        "maxBoxChip": 50
    },
        {
            "minLevel": 21,
            "maxLevel": 100000000,
            "subAmount": 5,
            "probability": 0.8,
            "mostBoxNumber": 1,
            "minBoxChip": 20,
            "maxBoxChip": 50
        }
    ],
    "generalConfig": {
        "objectStageBottomProbability": 0.1,
        "objectStageMiddleProbability": 0.4,
        "objectStageTopProbability": 0.5,
        "objectStageBottomScale": 0.25,
        "objectStageMiddleScale": 0.5,
        "objectStageTopScale": 0.25,

        "gunUnlockChip": 250,
        "bowUnlockChip": 500,

        "stageOneLevel":30,
        "stageTwoLevel":100,

        "machineChipDouble": 0.4,
        "machineChipDoubleThree": 0.3
    },
    "rewardOpenTypeConfig" : {
        "newWeapon": {
            "bsgs":["checkBox"],
            "nBsgs":["checkBox"],
            "check":["direct"]
        },
        "newObject": {
            "bsgs":["checkBox"],
            "nBsgs":["checkBox"],
            "check":["direct"]
        },
        "chipBox":{
            "bsgs":["checkBox"],
            "nBsgs":["share"],
            "check":["direct"]
        },
        "chipMachine":{
            "bsgs":["share"],
            "nBsgs":["share"],
            "check":["direct"]
        },
        "weaponMachine":{
            "bsgs":["checkBox"],
            "nBsgs":["share"],
            "check":["direct"]
        },
        "resurgence": {
            "bsgs":["share"],
            "nBsgs":["share"],
            "check":["omit"]
        }
    },

    // //过审配置
    doubleVersionConfig : {
        allCheckVersion : 1.00
    },
    //分享配置
    shareConfig : null
};

double.windowNewWeaponType = {
    newObject : 1,
    newWeapon : 2,
    goldTreasureChest : 3,
    newResultRollOne : 4,
    newResultRollTwo : 5,
    newResultRollThree : 6
};