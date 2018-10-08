// 整个游戏的数据，集中存放
scratch.GameWorld = {
    nsLoginDays : 0,
    //
    cardListInfo : null,
    showCardList : null,
    //
    productList : null,
    //邀请奖励
    getRewardCount: 0,                 // 实际可以领奖人数
    rewards: null,
    currInviteNum: 0,                  // 已经邀请得人数
    maxInviteNum: 0,
    todayInvite : 0,

    newUserCardId : 0,


    //配置文件:
    "normalConfig":{
        // "showCardList":["1001","1002","1003","1004","1005","1006","1007","1008","1009","1010","1011"],
        "showCardList":null,

        "cardConditionDic":{"1001":{"continue":0}, "1002":{"share":0}, "1003":{"invite":0}, "1004":{"scratchCount":0}, "1005":{"continue":0},
            "1006":{"continue":0}, "1007":{"continue":0}, "1008":{"continue":0},"1009":{"continue":0},"1010":{"continue":0},"1011":{"continue":0},
            "1012":{"continue":0}, "1013":{"continue":0}, "1014":{"continue":0},"1015":{"continue":0},"1016":{"continue":0},"1017":{"continue":0},
            "1018":{"continue":0}, "1019":{"continue":0}, "1020":{"continue":0},"1021":{"continue":0},"1022":{"continue":0},"1023":{"continue":0},
            "1024":{"continue":0}, "1025":{"continue":0}, "1026":{"continue":0},"1027":{"continue":0},"1028":{"continue":0},"1030":{"continue":0},
            "1031":{"continue":0}, "1032":{"continue":0}, "1033":{"continue":0},"1034":{"continue":0},"1035":{"continue":0},"1036":{"continue":0}},
        "videoGetRewardCount": 10000,
        "inviteGetRewardCount": 100000,
        "videoDayWatch": 3,
        "shareChipCountLimit": 1500,

        "illegalConfig":{
            "checkVersion":1.00,
            "checkState":false,
            "noCheckState": {
                "mainCard": true,
                "cardCondition": true,
                "turnTable": true
            }
        }
    }
};