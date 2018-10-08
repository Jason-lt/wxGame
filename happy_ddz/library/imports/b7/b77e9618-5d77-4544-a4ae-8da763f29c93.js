"use strict";
cc._RF.push(module, 'b77e9YYXXdFRKSujadj8pyT', 'ddz_main');
// Script/ComponentScript/window/ddz_main.js

"use strict";

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_main');
// window.setTitleString("闯八关平分100万奖金");
// window.setDetailInformation("12345678","12:54:51");

cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._counter = 0;
        this._TAG = "ddz_main.js";
    },

    properties: {

        leftSeconds: 0,
        winnerCount: 0,
        rewardDes: "",
        startButtonList: {
            default: null,
            type: cc.Node
        },

        mainBtnBar: cc.Node,

        topButton: {
            default: null,
            type: cc.Button
        },

        buttom: {
            default: null,
            type: cc.Node
        },

        bottomBar: {
            default: null,
            type: cc.Node
        },

        giftBagBtnNode: cc.Node,

        noticeNode: {
            default: null,
            type: cc.Node
        },

        // noticeLabel: {
        //     default : null,
        //     type : cc.Label
        // },

        inviteeList: [],

        messageNode: {
            default: null,
            type: cc.Node
        },

        giftBagNode: {
            default: null,
            type: cc.Node
        },

        notifyList: [],

        parentScene: {
            default: null,
            serializable: false
        },

        notifyNode: {
            default: null,
            type: cc.Node
        },

        startLabel: {
            default: null,
            type: cc.Label
        },

        ledNode: {
            default: null,
            type: cc.Node
        },

        ledBg: {
            default: null,
            type: cc.Sprite
        },

        ledRichText: {
            default: null,
            type: cc.RichText
        },

        haveReward: cc.Node,

        menuColumn: cc.Node,

        redDotSpr: cc.Node,

        count: "",
        money: ""
    },
    onLoad: function onLoad() {
        var couponCount = hall.ME.udataInfo.m_couponCount;
        // hall.MsgFactory.getBagInfo();
        // this.addTipsWindowWith("4","10","5");
        this.rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "闯七关瓜分100万红包");

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_INFO, this.onUpDateMatchInfo, this);

        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.updateMatchInfo, this);

        this.updateNotifyInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG, this.updateNotifyInfo, this);

        ty.NotificationCenter.listen(ddz.EventType.REMOVE_DDZ_MAIN_ANI, this.onRemoveAni, this);

        ty.NotificationCenter.listen(ddz.EventType.CMD_LED_RECEIVE, this.playLed, this);
        ty.NotificationCenter.listen(ddz.EventType.MATCH_GIVE_UP, this.onMatchGiveUp, this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);

        ty.NotificationCenter.listen(ddz.EventType.IS_HAVE_REWARD, this.isHaveReward, this);

        this.ledNode.active = false;

        var _height = ddz.GlobalFuncs.getMainInterY();
        if (_height) {
            this.buttom.y = _height;
            this.ledNode.y = this.ledNode.y + _height / 3;
        }
        this.updateGiftBagCount();
        this.updateBtnState();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_COUNT, this.updateMessageCount.bind(this), this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_GIFTBAG_COUNT, this.updateGiftBagCount.bind(this), this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_BTN_STATE, this.updateBtnState.bind(this), this);

        ddz.gameModel.getOpenBox();
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.getDayFirstLogin);
        ddz.gameModel.getDayInviteReward();
        // hall.GlobalFuncs.btnScaleEffect(this.topButton.node,1.13,0.9);
    },

    onMatchGiveUp: function onMatchGiveUp() {
        this.changeEnterBtnState(1);
    },

    playLed: function playLed(result) {
        var model = hall.gameWorld.model;
        model.m_ledBeWork = true;
        var _ledList = model.m_ledList; // {"text": result[i].text, "color": cc.color(result[i].color), "size": 22}
        this.ledNode.active = true;
        var index = 0;
        var _moveTime = 0.6;
        var that = this;
        var _playLed = function _playLed() {
            var data = _ledList[index];
            if (data && data.length > 0) {
                that.ledRichText.string = "<color=#" + data[0].color + ">" + data[0].text + "</color>";
                var size = that.ledBg.node.getContentSize();
                that.ledRichText.node.y = -size.height;
                var showMove = cc.moveTo(_moveTime, cc.p(that.ledRichText.node.x, -1));
                var hideMove = cc.moveTo(_moveTime, cc.p(that.ledRichText.node.x, size.height));
                var delay = cc.delayTime(3);
                that.ledRichText.node.stopAllActions();
                that.ledRichText.node.runAction(cc.sequence(showMove, delay, hideMove, cc.callFunc(function () {
                    _playLed();
                    if (index == model.m_ledCapacity) {
                        model.m_ledBeWork = false;
                        // this.ledNode.active = false;
                        model.m_ledLast = 0;
                        model.m_ledList = [];
                    }
                }, that)));
                index += 1;
            } else {
                that.ledNode.active = false;
                model.m_ledBeWork = false;
                model.m_ledLast = 0;
                model.m_ledList = [];
            }
        };
        _playLed();
    },

    loadingAction: function loadingAction() {
        this.buttom.active = false;

        this.startButtonList.active = false;
        this.bottomBar.active = false;
        this.menuColumn.active = false;
        hall.adManager.hideAd();
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }
        if (hall.sxAdManager) {
            hall.sxAdManager.hide();
        }
    },
    unLoadingAction: function unLoadingAction() {
        this.buttom.active = true;

        this.menuColumn.active = true;
        this.startButtonList.active = true;
        this.bottomBar.active = true;

        var _height = ddz.GlobalFuncs.getMainInterY();
        if (_height) {
            this.buttom.y = _height;
        }
    },
    onUpDateMatchInfo: function onUpDateMatchInfo() {
        var info = ddz.matchModel.getCurUpdateInfo();
        if (!info || !info.lotteryInfo) {
            return;
        }

        var rewardDes = info.lotteryInfo.desc;
        ddz.Share.shareKeywordReplace.bonusTotal = rewardDes;

        this.leftSeconds = info.lotteryInfo.leftSeconds;
    },

    updateBtnState: function updateBtnState() {
        var isOncePlay = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ONCEPLAYGAME, false);
        if (ddz.gameModel.isNewUser && !isOncePlay) {
            // this.startButtonList.active = false;
            // this.mainLeftBtnList.active = false;
            // this.mainRightBtnList.active = false;
            // hall.adManager.hideAd();
            // if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            //     hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
            // }
            // if (hall.sxAdManager) {
            //     hall.sxAdManager.hide();
            // }
        } else {
                // this.startButtonList.active = true;
                // this.mainLeftBtnList.active = true;
                // this.mainRightBtnList.active = true;
            }
    },

    updateMatchInfo: function updateMatchInfo() {
        /*
         　"histories":{
         　　　　　　"winnerCount":2,
         　　　　　　"matchCount":2,
         　　　　　　"curLottery":{
         　　　　　　　　"winnerCount":2,
         　　　　　　　　"lotteryTime":"2018-04-08 19:15",
         　　　　　　　　"rewards":[
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":2,
         　　　　　　　　　　　　"itemId":"item:1311"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":1200000,
         　　　　　　　　　　　　"itemId":"user:chip"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":10000,
         　　　　　　　　　　　　"itemId":"user:coupon"
         　　　　　　　　　　}
         　　　　　　　　]
         　　　　　　},
         　　　　　　"records":Array[2]
         　　　　},
          "saveInfo":{
         "record":{
         "stageIndex":2,
         "state":2,
         "gameFlow":false,
         "enterTime":1526141228
         },
         "needResume":0
         }
         */
        var matchDes = ddz.matchModel.getCurDes();
        var histories = matchDes.histories;
        if (histories) {
            var todayM = histories.curLottery;
            if (todayM && todayM.winnerCount && todayM.winnerCount > 0) {
                ddz.Share.shareKeywordReplace.curWinnerCount = todayM.winnerCount;
            }
        }

        var savaInfo = matchDes.saveInfo;
        if (matchDes.matchId == 6789 && savaInfo && savaInfo.record && savaInfo.record.stageIndex) {
            this.changeEnterBtnState(savaInfo.record.stageIndex);
        }
    },
    changeEnterBtnState: function changeEnterBtnState(_stageIndex) {
        this.startLabel.string = "第" + _stageIndex + "关";
    },

    onClickCenterButton: function onClickCenterButton(event) {
        var shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        ddz.Share.shareWithType(shareType);
    },
    update: function update(dt) {},
    onDestroy: function onDestroy() {
        var model = hall.gameWorld.model;
        model.m_ledBeWork = false;
        ty.NotificationCenter.ignoreScope(this);
    },

    updateRewardMassage: function updateRewardMassage(result) {
        var resultMap;
        if (result) {
            resultMap = result.result;
        }
        var showList = [];
        if (resultMap && resultMap.inviteeList && resultMap.inviteeList.length > 0) {
            var inviteeList = resultMap.inviteeList;
            for (var i = 0; i < inviteeList.length; i++) {
                if (inviteeList[i].rewardState == 1) {
                    inviteeList[i].bindRewardCount = resultMap.bindRewardCount;
                    inviteeList[i].type = 1;
                    showList.push(inviteeList[i]);
                }
            }
        }

        //查询未展示的登录奖励
        var tips = hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
        if (tips[0]) {
            var tipsList = tips[0].split(',');
            if (tipsList && tipsList.length > 0) {
                for (var i = 0; i < tipsList.length; i++) {
                    var reward = {};
                    reward.type = 2;
                    reward.bindRewardCount = tipsList[i];
                    showList.push(reward);
                }
            }
        }

        if (showList.length > 0) {
            this.inviteeList = showList;
        }
    },

    // 打开菜单栏
    openMenuColumn: function openMenuColumn() {
        //判断网络状态是否可以响应按钮事件
        if (!debugMode) {
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
                hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }
        // this.menuColumn.active = true;
        var com = this.menuColumn.getComponent("ddz_ceLaMenu");
        com.updateCeLaMunuInfo();
        // hall.adManager.hideAd();
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }
    },

    updateNotifyInfo: function updateNotifyInfo() {
        // this.redDotSpr.active = (ddz.gameModel.notifyInfo.unReadCount + ddz.gameModel.messageCount) > 0;

        var isOncePlay = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ONCEPLAYGAME, false);
        if (!ddz.gameModel.isNewUser || isOncePlay) {
            if (ddz.gameModel.notifyInfo.autoShowCount) {
                var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
                var indexList = JSON.parse(indexStr);
                var notifyList = ddz.gameModel.notifyInfo.info;
                for (var i = 0; i < notifyList.length; i++) {
                    var notify = notifyList[i];
                    if (indexList.indexOf(notify.index) == -1 && notify.autoShow) {
                        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
                            var window = preFabNode.getComponent('ddz_notifyWindow');
                            window.setDetailTypeWithInfoMap(notify, "auto");
                        });
                    }
                }
            }
        }
    },

    onNoticeButton: function onNoticeButton() {
        // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["notice"]);
        // ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        // hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
        //     var window = preFabNode.getComponent('ddz_notifyWindow');
        //     window.setListType();
        // });
    },
    updateMessageCount: function updateMessageCount(data) {
        var _count = 0;
        if (data.inviteeList && data.inviteeList.length > 0) {
            for (var i = 0; i < data.inviteeList.length; i++) {
                if (data.inviteeList[i].rewardState == 0) {
                    _count++;
                }
            }
        }

        hall.LOGD("==", " file = [ddz_main] fun = [updateMessageCount] _count = " + _count);

        this.messageNode.active = _count && _count > 0;
    },

    updateGiftBagCount: function updateGiftBagCount() {
        if (ddz.gameModel.notifyInfo.getInfo) {
            if (ddz.gameModel.notifyInfo.autoShowCount) {
                // this.giftBagNode.active = false;
            } else {
                if (ddz.gameModel.gongZhonghaoCardPoint > 0) {
                    // this.giftBagNode.active = true;
                    var tips = "关注公众号,领豪华礼包";
                    hall.GlobalFuncs.onBubbleTips(this.giftBagBtnNode, tips);
                } else {
                    // this.giftBagNode.active = ddz.gameModel.gongZhonghaoMenuPoint > 0;
                }
            }
        }
    },

    updateButtonText: function updateButtonText(data) {
        if (data.pointId && data.pointId == ddz.Share.SharePointType.getDayFirstLogin) {
            if (data.leftCount > 0) {
                if (ddz.gameModel.gongZhonghaoMenuPoint > 0 && ddz.gameModel.gongZhonghaoCardPoint <= 0) {
                    var tips = "从公众号登录,领天天礼包";
                    hall.GlobalFuncs.onBubbleTips(this.giftBagBtnNode, tips);
                }
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.getDayFirstLogin);
            }
        }
    },

    isHaveReward: function isHaveReward(data) {
        var _count = 0;
        if (data.rewards) {
            // 未领取
            var _rewards = data.rewards;
            if (_rewards['item:1311'] > 0) {
                _count = _count + _rewards['item:1311'];
            }
            if (_rewards['user:chip'] > 0) {
                _count = _count + _rewards['user:chip'];
            }
        }
        this.haveReward.active = _count > 0;
    },

    onRemoveAni: function onRemoveAni() {
        hall.LOGD("==", " file = [ddz_main] fun = [onRemoveAni] ");
        this.notifyNode.removeAllChildren();
        // this.topButton.node.stopAllActions();
    }

});

cc._RF.pop();