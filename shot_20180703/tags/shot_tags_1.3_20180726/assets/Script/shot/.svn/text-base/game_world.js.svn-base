// 整个游戏的数据，集中存放
shot.GameWorld = {
    game_friendData : null,
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
    //测试
    initGameLevel : 1,
    canUserLaser : false,
    //游戏数据--瓶子道具子弹属性
    bottleNameList : ["green","purple","orange","red","treasureBox","treasureBox1"],
    treasureBoxTypeList : ["laserGun","infiniteBullet","doubleGun","shotGun","Kar98k","win94","M16","Thompson"],
    bulletTypeList : ["bulletType0","bulletType1","bulletType2","bulletType3","bulletType4","bulletType5","bulletType6"],
    //子弹当前可用状态
    bulletType : "",
    bulletBlood : "",
    bulletPenetrate : "",
    doubleGunUseTimeCan : 0,//当前子弹道具总共可使用的次数
    bulletRange : 0,
    bulletRunningTimeCan : 0,//子弹可连发数量
    bulletRunningInterval : 0,
    gunFireInterval : 0,//按住自动连发时间间隔
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
    //游戏数据--游戏过程中
    gameLevel : 1,
    lastTreasureLevel : 0,
    bucketCount : 0,
    bottleCount : 0,
    bulletCount : 0,
    bulletInfinite : false,
    totalScore : 0,
    doubleHitCount : 0,
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
            "penetrate": 3,
            "blood": 1,
            "range": 0,
            "runningFireTime":3,
            "runningInterval":6
        },
        "bulletType6": {
            "penetrate": 1,
            "blood": 1,
            "range": 0,
            "gunFireInterval":5
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
                "minLevel": 7,
                "maxLevel": 8,
                "boxList": [{
                    "treasureBoxType": "treasureBox1",
                    "probability": 0.6
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
                "minLevel": 18,
                "maxLevel": 18,
                "boxList": [{
                    "treasureBoxType": "treasureBox1",
                    "probability": 1
                }]
            },
            {
                "minLevel": 19,
                "maxLevel": 19,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                }]
            },
            {
                "minLevel": 23,
                "maxLevel": 25,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.5
                }]
            },
            {
                "minLevel": 28,
                "maxLevel": 28,
                "boxList": [{
                    "treasureBoxType": "treasureBox1",
                    "probability": 1
                }]
            },
            {
                "minLevel": 29,
                "maxLevel": 30,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.4
                }]
            },
            {
                "minLevel": 31,
                "maxLevel": 38,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 39,
                "maxLevel": 39,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.5
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 41,
                "maxLevel": 47,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 48,
                "maxLevel": 48,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.5
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 51,
                "maxLevel": 58,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 59,
                "maxLevel": 59,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.4
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 61,
                "maxLevel": 66,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 67,
                "maxLevel": 67,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.4
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 71,
                "maxLevel": 77,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 78,
                "maxLevel": 78,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.4
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 81,
                "maxLevel": 88,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 89,
                "maxLevel": 89,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.3
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 91,
                "maxLevel": 99,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 100,
                "maxLevel": 100,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.7
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            },
            {
                "minLevel": 101,
                "maxLevel": 10000,
                "boxList": [{
                    "treasureBoxType": "treasureBox",
                    "probability": 0.1
                },
                    {
                        "treasureBoxType": "treasureBox1",
                        "probability": 0.1
                    }]
            }
        ],
        "rewardConfig": {
            "treasureBox": {
                "laserGun": 0,
                "infiniteBullet": 0,
                "doubleGun": 0.1,
                "shotGun": 0.1,
                "Kar98k": 0.2,
                "win94": 0.1,
                "M16": 0.25,
                "Thompson": 0.25

            },
            "treasureBox1": {
                "laserGun": 0.4,
                "infiniteBullet": 0.6,
                "doubleGun": 0,
                "shotGun": 0,
                "Kar98k": 0,
                "win94": 0
            }
        },
        "showAtWindow": {
            "bsgs": {
                "text": "炫耀一下并开启",
                "share": true
            },
            "nBsgs": {
                "text": "分享到群开启",
                "share": true
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
        "resurgenceTime": 2,
        "infiniteBulletTime": 3,
        "laserTime": 3,
        "closeBoxTime":2,
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
        "crazyLevelList": [5,10,15,20,30,40,50,60,70,80,90,100],
        "crazyLevelConfig": [
            {
                "crazyLevel": 5,
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
                "crazyLevel": 10,
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
                "crazyLevel": 15,
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
                "crazyLevel": 20,
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
                "crazyLevel": 30,
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
                "crazyLevel": 40,
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
                "crazyLevel": 50,
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
                "crazyLevel": 60,
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
                "crazyLevel": 70,
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
                "crazyLevel": 80,
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
                "crazyLevel": 90,
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
                "crazyLevel": 100,
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
    //过审配置
    gunnerShareSchemeConfig : null,
    //分享配置
    shareConfig : null
};