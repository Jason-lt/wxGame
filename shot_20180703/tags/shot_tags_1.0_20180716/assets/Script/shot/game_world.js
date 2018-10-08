// 整个游戏的数据，集中存放
shot.GameWorld = {
    game_friendData : null,
    //游戏状态
    gameOver : true,
    gamePause : false,
    //测试
    initGameLevel : 1,
    canUserLaser : false,
    //游戏数据--静态
    bottleNameList : ["green","purple","orange","red","treasureBox"],
    bulletType : "",
    bulletBlood : "",
    bulletPenetrate : "",
    bulletRange : 0,
    //游戏数据--动态
    gameLevel : 1,
    lastTreasureLevel : 0,
    bucketCount : 0,
    bottleCount : 0,
    bulletCount : 0,
    bulletInfinite : false,
    totalScore : 0,
    doubleHitCount : 0,
    //游戏数据--动态--道具使用
    resurgenceTime : 0, // 复活次数
    infiniteBulletTime : 0,
    addBulletTime : 0,
    laserTime : 0,
    doubleGunUseTime : -1,//-1为不可用状态
    doubleGunUseTimeCan : 0,//-1为不可用状态
    //游戏数据--动态--子弹属性
    nowBulletPenetrate : 0,
    //配置信息们
    //游戏配置
    bottleConfig : {
        "green": {
            "type": "green",
            "sectionR":12,
            "lifeCount": 1
        },
        "purple": {
            "type": "purple",
            "sectionR":12,
            "lifeCount": 2
        },
        "orange": {
            "type": "orange",
            "sectionR":11,
            "lifeCount": 3
        },
        "red": {
            "type": "red",
            "sectionR":18,
            "lifeCount": 5
        },
        "treasureBox":{
            "type": "treasureBox",
            "sectionR":18,
            "lifeCount": 2
        }
    },
    bulletConfig : {
        "bulletType0":{
            "penetrate" : 1,
            "blood":1
        },
        "bulletType1":{
            "penetrate" : 1,
            "blood":2
        },
        "bulletType2":{
            "penetrate" : 9,
            "blood":1,
            "range": 15
        }
    },
    propertyConfig : {
        "laserGun" : {
            "function" : "laserGun",
            "time": 5,
            "limitCount" : 5
        },
        "infiniteBullet" : {
            "function" : "infiniteBullet",
            "time": 3,
            "limitCount" : 5
        },
        "doubleGun" : {
            "bulletType" : "bulletType1",
            "time" : 3,
            "name" : "狙击枪",
            "desc" : "武器效果: 攻击力翻倍"
        },
        "shotGun":{
            "bulletType" : "bulletType2",
            "time" : 3,
            "name" : "霰弹枪",
            "desc" : "武器效果: 攻击范围大幅增加"
        }
    },
    treasureConfig : {
        "onlyConfig":[
            {
                "minLevel":3,
                "maxLevel":3
            },
            {
                "minLevel":7,
                "maxLevel":8
            },
            {
                "minLevel":13,
                "maxLevel":15
            },
            {
                "minLevel":21,
                "maxLevel":25
            },
            {
                "minLevel":29,
                "maxLevel":30
            }
        ],
        "probabilityConfig" :[
            {
                "minLevel":3,
                "maxLevel":3,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 1
                    }
                ]
            },
            {
                "minLevel":7,
                "maxLevel":8,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 0.6
                    }
                ]
            },
            {
                "minLevel":13,
                "maxLevel":15,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 0.5
                    }
                ]
            },
            {
                "minLevel":21,
                "maxLevel":25,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 0.5
                    }
                ]
            },
            {
                "minLevel":29,
                "maxLevel":30,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 0.4
                    }
                ]
            },
            {
                "minLevel":31,
                "maxLevel":10000,
                "boxList" : [
                    {
                        "treasureBoxType":"treasureBox",
                        "probability" : 0.1
                    }
                ]
            }
        ],
        "rewardConfig" : {
            "treasureBox" : {
                "laserGun" : 0.1,
                "infiniteBullet" : 0.1,
                "doubleGun": 0.5,
                "shotGun": 0.3
            }
        },
        "showAtWindow":{
            "bsgs":{
                "text":"开启",
                "share":false
            },
            "nBsgs":{
                "text":"开启",
                "share":false
            }
        }
    },
    scoreLevelConfig : {
        "specificLevel12":12,
        "initialScore":8,
        "decreaseScore":4,
        "limitScore":24
    },
    rotationTimeConfig : {
        "onlyBucket":{
            "oneToFour":4,
            "fiveToNine":3.6,
            "ten":3.3
        },
        "bottomBucket":{
            "initialTime":3.3,
            "decreaseTimeList":[
                {
                    "minLevel":11,
                    "maxLevel":24,
                    "decreaseTime":0.3
                },
                {
                    "minLevel":25,
                    "maxLevel":39,
                    "decreaseTime":0.2
                },
                {
                    "minLevel":40,
                    "maxLevel":10000,
                    "decreaseTime":0.1
                }
            ],
            "limitTime":0.8
        },
        "topBucket":{
            "initialTime":4.5,
            "decreaseTimeList":[
                {
                    "minLevel":11,
                    "maxLevel":24,
                    "decreaseTime":0.4
                },
                {
                    "minLevel":25,
                    "maxLevel":39,
                    "decreaseTime":0.3
                },
                {
                    "minLevel":40,
                    "maxLevel":54,
                    "decreaseTime":0.2
                },
                {
                    "minLevel":55,
                    "maxLevel":10000,
                    "decreaseTime":0.1
                }
            ],
            "limitTime":1
        }
    },
    bulletAddConfig : [
        {
            "minLevel":3,
            "maxLevel":5,
            "bulletAddCount":12
        },
        {
            "minLevel":6,
            "maxLevel":10,
            "bulletAddCount":12
        },
        {
            "minLevel":11,
            "maxLevel":12,
            "bulletAddCount":14
        },
        {
            "minLevel":13,
            "maxLevel":16,
            "bulletAddCount":20
        },
        {
            "minLevel":17,
            "maxLevel":19,
            "bulletAddCount":18
        },
        {
            "minLevel":19,
            "maxLevel":10000,
            "bulletAddCount":22
        }
    ],
    toolUserTimeConfig : {
        "resurgenceTime":2,
        "infiniteBulletTime":3,
        "laserTime":3,
        "addBullet" : {
            "time" : 3,
            "addCount" : 12,
            "showType" : {
                "bsgsch" : {
                    "show" : 0,
                    "showText" : "分享到群",
                    "type" : "share"
                },
                "nBsgsch" : {
                    "show" : 1,
                    "showText" : "分享到群",
                    "type" : "share"
                }
            }
        }
    },
    gunnerShareSchemeConfig : null,
    //分享配置
    shareConfig : null
};