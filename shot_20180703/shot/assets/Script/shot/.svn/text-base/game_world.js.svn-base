// 整个游戏的数据，集中存放
shot.GameWorld = {
    // game_friendData : null,
    //游戏状态
    gameOver : true,
    gamePause : false,
    gameGetBox : false,
    //疯狂时刻
    crazyMoment : false,
    crazyBonus : 0,
    crazyBottleCount :{"green":0,"purple":0,"orange":0,"red":0},
    crazyBottleHitCount : 0,
    crazyBottleScore : 0,
    //飞碟模式
    jugglingSchema : false,
    jugglingBottleCount :{"green":0,"purple":0,"orange":0,"red":0},
    jugglingBonus : 0,
    jugglingBonusPer : 0,
    verticalAccelerate : 0,
    jugglingOriginBottleCount : 0,
    jugglingMissBottleCount : 0,
    jugglingBottleHitCount : 0,
    jugglingBottleScore : 0,
    jugglingBulletCount : 0,
    //测试
    initGameLevel : 1,
    canUserLaser : false,
    //游戏数据--瓶子道具子弹属性
    initBulletType : null,
    bottleNameList : ["green","purple","orange","red","treasureBox","treasureBox1"],
    treasureBoxTypeList : ["laserGun","infiniteBullet","grenade","doubleGun","shotGun","Kar98k","win94","M16","Thompson","Gatling","Barrett"],
    bulletTypeList : ["bulletType0","bulletType1","bulletType2","bulletType3","bulletType4","bulletType5","bulletType6","bulletType7","bulletType8"],
    //子弹当前可用状态
    bulletType : "",
    bulletBlood : "",
    bulletPenetrate : "",
    doubleGunUseTimeCan : 0,//当前子弹道具总共可使用的次数
    bulletRange : 0,
    bulletRunningTimeCan : 0,//子弹可连发数量
    bulletRunningInterval : 0,
    gunFireInterval : 0,//按住自动连发时间间隔
    gunFireIntervalNow : 0,//按住自动连发时间间隔
    // isOnThompsonRunning : false,
    // bulletPenetrateBucket : false,
    //子弹当前使用状态
    nowBulletPenetrate : 0,
    doubleGunUseTime : -1,//-1为不可用状态
    bulletRunningTimeBottom : 0,//子弹当前可连发数量
    bulletRunningTimeTop : 0,//子弹当前可连发数量
    //游戏数据--动态--道具使用
    resurgenceTime : 0, // 复活次数
    infiniteBulletTime : 0,
    addBulletTime : 0,
    laserTime : 0,
    grenadeTime : 0,
    grenadeRunning : false,
    //游戏数据--游戏过程中
    gameLevel : 1,
    lastTreasureLevel : 0,
    bucketCount : 0,
    bottleCount : 0,
    bulletCount : 0,
    bulletInfinite : false,
    totalScore : 0,
    doubleHitCount : 0,
    doubleHitCountBest : 0,
    doubleHitCountDownTime : false,
    //配置信息们
    //游戏配置
    bottleConfig : {
        "green": {
            "type": "green",
            "sectionR": 12,
            "lifeCount": 1,
            "crazyBottleScore": 10
        },
        "purple": {
            "type": "purple",
            "sectionR": 12,
            "lifeCount": 2,
            "crazyBottleScore": 20
        },
        "orange": {
            "type": "orange",
            "sectionR": 11,
            "lifeCount": 3,
            "crazyBottleScore": 30
        },
        "red": {
            "type": "red",
            "sectionR": 18,
            "lifeCount": 5,
            "crazyBottleScore": 50
        },
        "treasureBox": {
            "type": "treasureBox",
            "sectionR": 18,
            "lifeCount": 2,
            "shareType": true
        },
        "treasureBox1": {
            "type": "treasureBox1",
            "sectionR": 18,
            "lifeCount": 2,
            "shareType": false
        }
    },
    bulletConfig : {
        "bulletType0": {
            "penetrate": 1,
            "blood": 1,
            "range": 0
        },
        "bulletType1": {
            "penetrate": 1,
            "blood": 3,
            "range": 0
        },
        "bulletType2": {
            "penetrate": 9,
            "blood": 1,
            "range": 15
        },
        "bulletType3": {
            "penetrate": 1,
            "blood": 2,
            "range": 0
        },
        "bulletType4": {
            "penetrate": 3,
            "blood": 1,
            "range": 0
        },
        "bulletType5": {
            "penetrate": 1,
            "blood": 1,
            "range": 0,
            "runningFireTime":3,
            "runningInterval":6
        },
        "bulletType6": {
            "penetrate": 1,
            "blood": 1,
            "range": 0,
            "gunFireInterval":6
        },
        "bulletType7": {
            "penetrate": 1,
            "blood": 1,
            "range": 0,
            "gunFireInterval":4
        },
        "bulletType8": {
            "penetrate": 3,
            "blood": 5,
            "range": 0
        }
    },
    propertyConfig : {
        "laserGun": {
            "function": "laserGun",
            "time": 5,
            "limitCount": 5
        },
        "infiniteBullet": {
            "function": "infiniteBullet",
            "time": 5,
            "limitCount": 5
        },
        "grenade":{
            "function": "grenade",
            "time": 5,
            "limitCount": 5
        },
        "doubleGun": {
            "bulletType": "bulletType1",
            "time": 3,
            "name": "AWM狙击枪",
            "desc": "武器效果: 攻击力×3"
        },
        "shotGun": {
            "bulletType": "bulletType2",
            "time": 3,
            "name": "霰弹枪",
            "desc": "武器效果: 攻击范围大幅增加"
        },
        "Kar98k": {
            "bulletType": "bulletType3",
            "time": 3,
            "name": "98k狙击枪",
            "desc": "武器效果: 攻击力×2"
        },
        "win94": {
            "bulletType": "bulletType4",
            "time": 3,
            "name": "温彻斯特步枪",
            "desc": "武器效果：可穿透重叠的瓶子"
        },
        "M16": {
            "bulletType": "bulletType5",
            "time": 3,
            "name": "M16步枪",
            "desc": "武器效果：可进行三连发点射"
        },
        "Thompson": {
            "bulletType": "bulletType6",
            "time": 3,
            "name": "汤姆逊冲锋枪",
            "desc": "武器效果：按住屏幕可连发射击"
        },
        "Gatling": {
            "bulletType": "bulletType7",
            "time": 3,
            "name": "加特林机枪",
            "desc": "武器效果：射速极快，按住屏幕可连发射击"
        },
        "Barrett": {
            "bulletType": "bulletType8",
            "time": 3,
            "name": "巴雷特狙击枪",
            "desc": "武器效果：攻击力×5，可穿透重叠的瓶子"
        }
    },
    treasureConfig : {
        "onlyConfig": [{
            "minLevel": 3,
            "maxLevel": 3
        },
            {
                "minLevel": 7,
                "maxLevel": 8
            },
            {
                "minLevel": 9,
                "maxLevel": 9
            },
            {
                "minLevel": 13,
                "maxLevel": 15
            },
            {
                "minLevel": 18,
                "maxLevel": 18
            },
            {
                "minLevel": 19,
                "maxLevel": 19
            },
            {
                "minLevel": 23,
                "maxLevel": 25
            },
            {
                "minLevel": 28,
                "maxLevel": 28
            },
            {
                "minLevel": 29,
                "maxLevel": 30
            }
        ],
        "probabilityConfig": [{
            "minLevel": 3,
            "maxLevel": 3,
            "boxList": [{
                "treasureBoxType": "treasureBox",
                "probability": 1
            }]
        },
            {
                "minLevel": 9,
                "maxLevel": 9,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 1
                }]
            },
            {
                "minLevel": 13,
                "maxLevel": 15,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.6
                }]
            },
            {
                "minLevel": 19,
                "maxLevel": 19,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.8
                }]
            },
            {
                "minLevel": 23,
                "maxLevel": 25,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.6
                }]
            },
            {
                "minLevel": 29,
                "maxLevel": 30,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 31,
                "maxLevel": 38,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 39,
                "maxLevel": 39,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.6
                }]
            },
            {
                "minLevel": 41,
                "maxLevel": 47,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 48,
                "maxLevel": 48,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 51,
                "maxLevel": 58,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 59,
                "maxLevel": 59,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 61,
                "maxLevel": 66,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 67,
                "maxLevel": 67,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 71,
                "maxLevel": 77,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 78,
                "maxLevel": 78,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 81,
                "maxLevel": 88,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 89,
                "maxLevel": 89,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.6
                }]
            },
            {
                "minLevel": 91,
                "maxLevel": 99,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                }]
            },
            {
                "minLevel": 100,
                "maxLevel": 100,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.8
                }]
            },
            {
                "minLevel": 101,
                "maxLevel": 10000,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.2
                }]
            }
        ],
        "rewardConfig": {
            "treasureBox": {
                "laserGun": 0,
                "infiniteBullet": 0,
                "grenade":0,
                "doubleGun": 0.1,
                "shotGun": 0.15,
                "Kar98k": 0.15,
                "win94": 0.1,
                "M16": 0.15,
                "Thompson": 0.15,
                "Gatling": 0.1,
                "Barrett": 0.1
            },
            "treasureBox1": {
                "laserGun":0,
                "infiniteBullet": 0.4,
                "grenade":0.6,
                "doubleGun": 0,
                "shotGun": 0,
                "Kar98k": 0,
                "win94": 0,
                "M16": 0,
                "Thompson": 0,
                "Gatling": 0,
                "Barrett": 0
            }
        },
        "showAtWindow": {
            "bsgs": {
                "text": "炫耀一下并开启",
                "share": true,
                "openType":["checkbox","ad","direct"],
                "shareProbability": 100
            },
            "nBsgs": {
                "text": "炫耀一下并开启",
                "share": true,
                "openType":["share","ad","direct"],
                "shareProbability": 100
            },
            "tishen":{
                "openType":["ad","direct"],
                "shareProbability": 100
            }
        }
    },
    scoreLevelConfig : {
        "specificLevel12": 12,
        "initialScore": 8,
        "decreaseScore": 4,
        "limitScore": 24
    },
    rotationTimeConfig : {
        "onlyBucket": {
            "oneToFour": 4,
            "fiveToNine": 3.6,
            "ten": 3.3
        },
        "bottomBucket": {
            "initialTime": 3.3,
            "decreaseTimeList": [{
                "minLevel": 11,
                "maxLevel": 24,
                "decreaseTime": 0.3
            },
                {
                    "minLevel": 25,
                    "maxLevel": 39,
                    "decreaseTime": 0.2
                },
                {
                    "minLevel": 40,
                    "maxLevel": 10000,
                    "decreaseTime": 0.1
                }
            ],
            "limitTime": 0.8
        },
        "topBucket": {
            "initialTime": 4.5,
            "decreaseTimeList": [{
                "minLevel": 11,
                "maxLevel": 24,
                "decreaseTime": 0.4
            },
                {
                    "minLevel": 25,
                    "maxLevel": 39,
                    "decreaseTime": 0.3
                },
                {
                    "minLevel": 40,
                    "maxLevel": 54,
                    "decreaseTime": 0.2
                },
                {
                    "minLevel": 55,
                    "maxLevel": 10000,
                    "decreaseTime": 0.1
                }
            ],
            "limitTime": 1
        }
    },
    bulletAddConfig :[{
        "minLevel": 3,
        "maxLevel": 5,
        "bulletAddCount": 12
    },
        {
            "minLevel": 6,
            "maxLevel": 10,
            "bulletAddCount": 12
        },
        {
            "minLevel": 11,
            "maxLevel": 12,
            "bulletAddCount": 14
        },
        {
            "minLevel": 13,
            "maxLevel": 16,
            "bulletAddCount": 20
        },
        {
            "minLevel": 17,
            "maxLevel": 19,
            "bulletAddCount": 18
        },
        {
            "minLevel": 19,
            "maxLevel": 10000,
            "bulletAddCount": 22
        }
    ],
    toolUserTimeConfig : {
        "resurgenceTime": 3,
        "resurgenceType" : {
            "bsgs":["ad","omit"],
            "nBsgs":["share"],
            "shareProbabilityB":100,
            "shareProbabilityN":100
        },
        "diamondShow":{
            "bsgs":false,
            "nBsgs": false
        },
        "mysteryShow":{
            "bsgs":false,
            "nBsgs": false
        },
        "infiniteBulletTime": 3,
        "laserTime": 3,
        "grenadeTime":3,
        "comboContinue":50,
        "comboContinueTime": 3,
        "propType": {
            "getItem":{
                "bsgs":["shareClick"],
                "nBsgs": ["share"]
            },
            "combo":{
                "bsgs":["ad","share"],
                "nBsgs": ["share"]
            }
        },
        "closeBoxTime":2,
        "closeCheckBoxTime": 1,
        "addBullet": {
            "time": 3,
            "addCount": 12,
            "showType": {
                "bsgsch": {
                    "show": 0,
                    "showText": "分享到群",
                    "type": "share"
                },
                "nBsgsch": {
                    "show": 1,
                    "showText": "分享到群",
                    "type": "share"
                }
            }
        }
    },
    crazyMomentConfig : {
        "crazyLevelList": [10,20,30,40,50,60,70,80,90,100,110,120],
        "crazyLevelConfig": [
            {
                "crazyLevel": 10,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 1000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "green": 30
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "green": 30
                        }
                    }
                ]
            },
            {
                "crazyLevel": 20,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 2000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "purple": 24
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "green": 24
                        }
                    }
                ]
            },
            {
                "crazyLevel": 30,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 3000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "purple": 20
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "orange": 18
                        }
                    }
                ]
            },
            {
                "crazyLevel": 40,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 4000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "green": 40
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "orange": 24
                        }
                    }
                ]
            },
            {
                "crazyLevel": 50,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 6000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "orange": 20
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "red": 15
                        }
                    }
                ]
            },
            {
                "crazyLevel": 60,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 8000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "orange": 24
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "red": 18
                        }
                    }
                ]
            },
            {
                "crazyLevel": 70,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 10000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "orange": 30
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "orange": 30
                        }
                    }
                ]
            },
            {
                "crazyLevel": 80,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 12000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "purple": 40
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "red": 24
                        }
                    }
                ]
            },
            {
                "crazyLevel": 90,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 14000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "red": 24
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "orange": 36
                        }
                    }
                ]
            },
            {
                "crazyLevel": 100,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 16000,
                "crazyBucketList": [{
                    "crazyRotationTime": 3,
                    "bottleConfig": {
                        "orange": 40
                    }
                },
                    {
                        "crazyRotationTime": 5,
                        "bottleConfig": {
                            "orange": 40
                        }
                    }
                ]
            },
            {
                "crazyLevel": 110,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 18000,
                "crazyBucketList": [{
                    "crazyRotationTime": 2,
                    "bottleConfig": {
                        "orange": 40
                    }
                },
                    {
                        "crazyRotationTime": 4,
                        "bottleConfig": {
                            "red": 30
                        }
                    }
                ]
            },
            {
                "crazyLevel": 120,
                "crazyTime": 20,
                "propertyUse": "handGun",
                "bonusScore": 20000,
                "crazyBucketList": [{
                    "crazyRotationTime": 2,
                    "bottleConfig": {
                        "red": 36
                    }
                },
                    {
                        "crazyRotationTime": 4,
                        "bottleConfig": {
                            "red": 24
                        }
                    }
                ]
            }
        ]
    },
    jugglingSchemaConfig : {
        "jugglingLevelList": [5,15,25,35,45,55,65,75,85,95],
        "jugglingLevelConfig": [
            {
                "jugglingLevel": 5,
                "jugglingAccelerated":1000,
                "bonus":10,
                "bottleCount":20,
                "bulletCount":120,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":10,
                    "minSecondGap":1,
                    "maxSecondGap":2,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":10,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":700
                        }
                    }
                },
                    {
                        "minBottleCount":11,
                        "maxBottleCount":20,
                        "minSecondGap":1,
                        "maxSecondGap":1.8,
                        "minRotation":2,
                        "maxRotation":8,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":700
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 15,
                "jugglingAccelerated":1100,
                "bonus":10,
                "bottleCount":30,
                "bulletCount":130,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":20,
                    "minSecondGap":0.8,
                    "maxSecondGap":1.6,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":20,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":750
                        }
                    }
                },
                    {
                        "minBottleCount":21,
                        "maxBottleCount":30,
                        "minSecondGap":0.6,
                        "maxSecondGap":1.4,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":750
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 25,
                "jugglingAccelerated":1200,
                "bonus":10,
                "bottleCount":40,
                "bulletCount":140,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.6,
                    "maxSecondGap":1.2,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":30,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":800
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":40,
                        "minSecondGap":0.6,
                        "maxSecondGap":1,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":800
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 35,
                "jugglingAccelerated":1200,
                "bonus":10,
                "bottleCount":50,
                "bulletCount":150,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.6,
                    "maxSecondGap":0.9,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":30,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":850
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":50,
                        "minSecondGap":0.5,
                        "maxSecondGap":0.8,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":20,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":850
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 45,
                "jugglingAccelerated":1450,
                "bonus":10,
                "bottleCount":50,
                "bulletCount":150,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.5,
                    "maxSecondGap":0.6,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":30,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":950
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":50,
                        "minSecondGap":0.4,
                        "maxSecondGap":0.6,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":20,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":950
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 55,
                "jugglingAccelerated":1000,
                "bonus":10,
                "bottleCount":20,
                "bulletCount":130,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":10,
                    "minSecondGap":1,
                    "maxSecondGap":2,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":5,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":700
                        },
                        "purple": {
                            "bottleCount":5,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":700
                        }
                    }
                },
                    {
                        "minBottleCount":11,
                        "maxBottleCount":20,
                        "minSecondGap":1,
                        "maxSecondGap":1.8,
                        "minRotation":2,
                        "maxRotation":8,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":700
                            },
                            "purple": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":700
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 65,
                "jugglingAccelerated":1100,
                "bonus":10,
                "bottleCount":30,
                "bulletCount":145,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":20,
                    "minSecondGap":0.8,
                    "maxSecondGap":1.6,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":10,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":750
                        },
                        "purple": {
                            "bottleCount":10,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":750
                        }
                    }
                },
                    {
                        "minBottleCount":21,
                        "maxBottleCount":30,
                        "minSecondGap":0.6,
                        "maxSecondGap":1.4,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":750
                            },
                            "purple": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":750
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 75,
                "jugglingAccelerated":1200,
                "bonus":10,
                "bottleCount":40,
                "bulletCount":160,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.6,
                    "maxSecondGap":1.2,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":800
                        },
                        "purple": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":800
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":40,
                        "minSecondGap":0.6,
                        "maxSecondGap":1,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":800
                            },
                            "purple": {
                                "bottleCount":5,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":800
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 85,
                "jugglingAccelerated":1200,
                "bonus":10,
                "bottleCount":50,
                "bulletCount":175,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.6,
                    "maxSecondGap":0.9,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":850
                        },
                        "purple": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":850
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":50,
                        "minSecondGap":0.5,
                        "maxSecondGap":0.8,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":850
                            },
                            "purple": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":850
                            }
                        }
                    }
                ]
            },
            {
                "jugglingLevel": 95,
                "jugglingAccelerated":1450,
                "bonus":10,
                "bottleCount":50,
                "bulletCount":150,
                "jugglingList": [{
                    "minBottleCount":0,
                    "maxBottleCount":30,
                    "minSecondGap":0.5,
                    "maxSecondGap":0.6,
                    "minRotation":2,
                    "maxRotation":8,
                    "bottleConfig": {
                        "green": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":950
                        },
                        "purple": {
                            "bottleCount":15,
                            "minRadius":40,
                            "maxRadius":60,
                            "speed":950
                        }
                    }
                },
                    {
                        "minBottleCount":31,
                        "maxBottleCount":50,
                        "minSecondGap":0.4,
                        "maxSecondGap":0.6,
                        "minRotation":2,
                        "maxRotation":6,
                        "bottleConfig": {
                            "green": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":950
                            },
                            "purple": {
                                "bottleCount":10,
                                "minRadius":40,
                                "maxRadius":60,
                                "speed":950
                            }
                        }
                    }
                ]
            }
        ]
    },

    growthConfig : {                   //交叉导流各开关配置
        "home" : ["CO","STU"],      //主页交叉导流icon开关
        "normalLevel" : ["STU"],    //游戏界面交叉导流icon开关
        "resurgence" : [],      //复活界面交叉导流icon开关
        "gameover" : ["STU"],        //结算界面交叉导流icon开关
        "reward" : ["CO","STU"],    //点击icon后是否给武器奖励开关
        "showRefresh" : true,            //1小时后恢复显示
        "showDelayed" : 1             //所有交叉导流icon在进行1局游戏后显示icon
    },
    //过审配置
    gunnerShareSchemeConfig : null,
    //分享配置
    shareConfig : null
};