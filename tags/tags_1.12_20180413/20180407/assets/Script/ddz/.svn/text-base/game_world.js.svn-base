// 整个游戏的数据，集中存放
ddz.GameWorld = {
    chatData : [], // 聊天数据缓存
    matchingMassage:[
        "邀请好友每天登录都送你钻石哟",
        "用钻石可复活，邀好友得钻石",
        "钻石越多闯关成功的可能性越大",
        "失败不要紧，钻石能救命",
        "每天首次登录都会送你钻石",
        "通关次数越多分得的奖金就越多",
        "通关多多，分钱多多",
        "抓紧闯关哟！倒计时结束就要瓜分奖金了",
        "快去排行里看你的好友排名吧",
        "“领奖”里可以看到你获得的奖金",
        "三人都不叫地主需重闯此关哟",
        "托管胜利不算胜利哟"],
    matchingMassageweight:[0,0,0,1,1,2,2,3,3,4,4,4,5,5,6,7,8,9,10,11],

    weChatVersionTips:"您当前的微信版本不支持此功能,请升级至6.6.2以上",

    openDataContextNullTips : "页面离家出走啦~",

    getRedPacketTips : "奖励将在24小时内到账,请在微信钱包查收",

    shareKeywordReplace :{
        // "bonusOnly":"0.00",//个人获得的奖励
        "allWinnerCount":"0",//当前通关人数
        "bonusTotal":"0",      //平分奖励金额
        "withDrawMoney":"0",//提现金额
        "wechatName":"。",//微信昵称
        "lastWinnerCount":"0",//自己上次通关人次
        "lastBonusOnly":"0",//自己上次获得奖励
        "curWinnerCount":"0",//自己本次次通关人次
        "curBonusOnly":"0"//自己本次获得奖励
    },

    shareConfig :{
        "share": {
            "clickStatShareTypeMainTips": {
                "massageList": [{
                    "formatString": "我玩斗地主赢了lastBonusOnly奖金！太容易啦，哈哈",
                    "focusImage": "res/raw-assets/resources/share/13.jpg?v=1"
                },
                    {
                        "formatString": "lastBonusOnly！平分bonusTotal，说走就走！",
                        "focusImage": "res/raw-assets/resources/share/212.jpg"
                    },
                    {
                        "formatString": "你得到了一个红包，立即领取>>>",
                        "focusImage": "res/raw-assets/resources/share/213.jpg"
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/13.jpg?v=1",
                    "imageType": "010011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/19.jpg",
                        "imageType": "010012"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/212.jpg",
                        "imageType": "010021"
                    }
                ],
                "sharePoint": 67890000
            },
            "clickStatShareTypeCongratulation": {
                "massageList": [{
                    "formatString": "我是第allWinnerCount位通关的，平分bonusTotal！还有sei！",
                    "focusImage": "res/raw-assets/resources/share/14.jpg?v=1"
                },
                    {
                        "formatString": "轻松闯过7关，我马上就要平分bonusTotal啦！",
                        "focusImage": "res/raw-assets/resources/share/222.jpg?v=1"
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/14.jpg?v=1",
                    "imageType": "020011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/222.jpg?v=1",
                        "imageType": "020021"
                    }
                ],
                "sharePoint": "67890001",
                "query": ""
            },
            "clickStatShareTypeWithDraw": {
                "massageList": [{
                    "formatString": "我在富豪斗地主领取了奖金，你也可以！",
                    "focusImage": "res/raw-assets/resources/share/231.jpg?v=1"
                },
                    {
                        "formatString": "【wechatName@你】玩斗地主，发家致富！你也来试试！",
                        "forcusImage": "res/raw-assets/resources/share/232.jpg?v=1"
                    },
                    {
                        "formatString": "自从玩了富豪斗地主，我的钱包再也没biĕ过！",
                        "focusImage": "res/raw-assets/resources/share/233.jpg?v=1"
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/231.jpg?v=1",
                    "imageType": "030011",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "withDrawMoney",
                            "fontSize": 76,
                            "textColorRGB": "#feff99",
                            "textAlign": "center",
                            "originPointX": 180,
                            "originPointY": 260
                        }
                    },
                        {
                            "type": "text",
                            "textInformation": {
                                "textformatString": "元",
                                "fontSize": 20,
                                "textColorRGB": "#feff99",
                                "textAlign": "left",
                                "originPointX": -2,
                                "originPointY": 260
                            }
                        },
                        {
                            "type": "text",
                            "textInformation": {
                                "textformatString": "恭喜你获得",
                                "fontSize": 20,
                                "textColorRGB": "#fef864",
                                "textAlign": "center",
                                "originPointX": 180,
                                "originPointY": 190
                            }
                        }
                    ],
                    "sizeWith": 360,
                    "sizeHeight": 288
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/232.jpg?v=1",
                        "imageType": "030021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/233.jpg?v=1",
                        "imageType": "030031"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeShareButton": {
                "massageList": [{
                    "formatString": "发现个好游戏，一只手就能斗地主，还能赢奖金！",
                    "focusImage": "res/raw-assets/resources/share/16.jpg"
                },
                    {
                        "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                        "focusImage": "res/raw-assets/resources/share/242.jpg?v=1"
                    }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/242.jpg?v=1",
                        "imageType": "040021"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeRankList": {
                "massageList": [{
                    "formatString": "本群斗地主实力排名！快来围观"
                }],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/6.png",
                    "imageType": "060011"
                }],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeGetDiamondFail": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": "res/raw-assets/resources/share/17.jpg"
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": "res/raw-assets/resources/share/252.jpg?v=1"
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg",
                    "imageType": "050011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/252.jpg?v=1",
                        "imageType": "050021"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeGetDiamondHall": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": "res/raw-assets/resources/share/17.jpg"
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": "res/raw-assets/resources/share/252.jpg?v=1"
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg",
                    "imageType": "050012"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/252.jpg?v=1",
                        "imageType": "050022"
                    }
                ],
                "sharePoint": "67890001"
            }
        }
    }
};