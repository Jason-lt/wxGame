// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        rewardMain : {
            default : null,
            type : cc.Node
        },
        withDraw : {
            default: null,
            type: cc.Node
        },
        detail : {
            default : null,
            type : cc.Node
        },
        redPacket : {
            default : null,
            type : cc.Node
        },
        debugNode : {
            default : null,
            type : cc.Node
        },
        getRewardButton : {
            default : null,
            type : cc.Button
        },
        moreButton : {
            default : null,
            type : cc.Button
        },
        drawButton : {
            default : null,
            type : cc.Button
        },
        conversionButton : {
            default : null,
            type : cc.Button
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        btnDebug : {
            default : null,
            type : cc.Button
        },
        redBar : {
            default : null,
            type : cc.Node
        },
        dataArray :[],
        nowType : 1//1、主界面,2、提现界面,3、奖励明细,4、领取红包成功,5、debug面板

    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var window;
        if (this.nowType == 1){
            var sceneName = 'Ddz';
            // cc.director.loadScene(sceneName);
            hall.GlobalFuncs.popScene();
        }else  if(this.nowType ==2){
            this.withDraw.active = false;
            this.rewardMain.active = true;
            this.nowType = 1;
            window = this.rewardMain.getComponent('ddz_getReward_main');
            window.setInformationWithTotalAndLoss();
            this.redBar.active = true;
        }else  if(this.nowType == 3){
            this.detail.active = false;
            this.rewardMain.active = true;
            this.nowType = 1;
            window = this.rewardMain.getComponent('ddz_getReward_main');
            window.setInformationWithTotalAndLoss();
            this.redBar.active = true;
        }else  if(this.nowType == 4){
            this.redPacket.active = false;
            this.withDraw.active = true;
            this.nowType = 2;
            window = this.withDraw.getComponent('ddz_getReward_Withdraw');
            window.setLossMoneyNumber();
            this.redBar.active = true;
        }else  if(this.nowType == 5){
            this.debugNode.active = false;
            this.withDraw.active = true;
            this.nowType = 2;
            window = this.withDraw.getComponent('ddz_getReward_Withdraw');
            window.setLossMoneyNumber();
            this.redBar.active = true;
        }
    },
    ctor : function () {
        // ddz.GlobalFuncs.drawGameCanvas();
    },
    onLoad :function() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        this.getRewardButton.node.on("click",this.onRewardButton,this);
        // this.getRewardButtonForRedIcon.node.on("click",this.onRewardButtonForRedIcon,this);
        this.moreButton.node.on("click",this.onMoreButton,this);
        this.drawButton.node.on("click",this.onDrawButton,this);
        this.conversionButton.node.on("click",this.onConversionButton,this);
        this.nowType = 1;

        // this.setOriginalData();
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.firstWithDraw);

        hall.MsgFactory.getUserRewardInfo();
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MESSAGE_LIST,this.onReciveMessageList,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        ty.NotificationCenter.listen(ddz.EventType.CHANGE_DEBUG_MODE, this.changeDebugMode, this);
        this.refreshDebugBtn();
    },
    refreshDebugBtn:function () {
        this.btnDebug.node.active = debugMode;
    },
    // setOriginalData : function () {
    //     ddz.LOGD(null, "主界面初始信息设置");
    //     var couponCount = hall.ME.udataInfo.m_couponCount;
    //     var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
    //     var window = this.rewardMain.getComponent("ddz_getReward_main");
    //     window.setInformationWithTotalAndLoss((couponCount+exchangedCoupon)/100+"",couponCount/100+"");
    // },
    setsetOriginalDataArray : function (dataArray) {
        this.dataArray = dataArray;
        var window = this.rewardMain.getComponent("ddz_getReward_main");
        window.setDitailList(this.dataArray);
    },
    onMoreButton : function () {
        ddz.LOGD(null, "onMoreButton进入奖励明细界面");
        var window = this.detail.getComponent('ddz_rewardDetail');
        window.setDataArrayWithArray(this.dataArray);
        this.rewardMain.active = false;
        this.detail.active = true;
        this.nowType = 3;
    },
    onRewardButton : function () {
        ddz.LOGD(null, "onRewardButton进入提现页面");
        var window = this.withDraw.getComponent('ddz_getReward_Withdraw');
        window.setLossMoneyNumber();
        this.rewardMain.active = false;
        this.withDraw.active = true;
        this.nowType = 2;
    },

    addTipsWindow : function (tips,timer,tips_2) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"分享",
                    bottomType : 0
                }
            ];
            window.setTitleContentAndButtons("提示",tips, testArray);
            if (timer && timer > 0){
                window.updatePos(timer,tips_2);
            }
        });
    },

    onClickCenterButton:function(){
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareCash);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareCash) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                }
                break;
            case 2:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                }
                
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    // 提现兑换金币弹窗
    addTipsAssets : function (tips) {
        var preFabPath = "prefabs/ddz_window_normal";
        var  comName = "ddz_window_normal";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tips + "</c>",[{title:"确定",callFunc:function () {
            }}]);
        });
    },
    
    onDrawButton:function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ['withDraw']);
        var draw = this.withDraw.getComponent('ddz_getReward_Withdraw');
        // if (!isNaN(Number(draw.drawMoeyString))) {
        //     var tips = "你还没有输入需兑换金额哦~";
        //     this.addTipsAssets(tips);
        //     return;
        // }
        if(!draw.lossMoneyString || draw.lossMoneyString == 0){
            // hall.MsgBoxManager.showToast({"title":"余额不足"});
            var tips = "余额不足，快去打牌赢奖吧";
            this.addTipsAssets(tips);
            return;
        }

        if(Number(draw.drawMoeyString) > Number(draw.lossMoneyString)){
            // hall.MsgBoxManager.showToast({"title":"余额不足"});
            var tips = "余额不足，快去打牌赢奖吧";
            this.addTipsAssets(tips);
            return;
        }

        var _drawMoeyString = draw.drawMoeyString;
        var that = this;
        if (ddz.gameModel.firstWithDrawPoint > 0) {  // 首次提现
            if(Number(draw.drawMoeyString) <= 0){
                // hall.MsgBoxManager.showToast({"title":"单笔提现金额最低5元"});
                var tips = "你还没有输入需兑换金额哦~";
                this.addTipsAssets(tips);
                return;
            }else if (Number(draw.drawMoeyString) < 0.3){
                var tips = "提现不得低于0.3元";
                this.addTipsAssets(tips);
                return;
            }else {
                ty.NotificationCenter.listen(ddz.EventType.UPDATE_CASH_RESULT,this.onCashResult,this);
                ddz.gameModel.getCashReward(parseInt(_drawMoeyString*100));
            }
            return;
        }
        if(draw.drawMoeyString < 5){
            // hall.MsgBoxManager.showToast({"title":"单笔提现金额最低5元"});
            var tips = "提现金额最低5元哦\n零钱还可兑换金币打牌赢奖~";
            this.addTipsAssets(tips);
            return;
        }

        if (draw.drawMoeyString.indexOf(".") > 0) {
            var arr = draw.drawMoeyString.split(".");
            _drawMoeyString = Math.floor(Number(_drawMoeyString));
            if (arr[1] && arr[1] > 0) {
                var tips = "提现仅支持整数\n先帮你提现" + _drawMoeyString + "元";
                var preFabPath = "prefabs/ddz_window_normal";
                var  comName = "ddz_window_normal";
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var window = preFabNode.getComponent(comName);
                    window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tips + "</c>",[{title:"取消",callFunc:function () {
                    }},{title:"提现",callFunc:function () {
                        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CASH_RESULT,that.onCashResult,that);
                        ddz.gameModel.getCashReward(parseInt(_drawMoeyString*100));
                    }}]);
                });
                return
            }
        }

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CASH_RESULT,this.onCashResult,this);
        ddz.gameModel.getCashReward(parseInt(_drawMoeyString*100));
    },

    onConversionButton:function(){
        var draw = this.withDraw.getComponent('ddz_getReward_Withdraw');
        if(!draw.drawMoeyString || draw.drawMoeyString <= 0){
            // hall.MsgBoxManager.showToast({"title":"余额不足"});
            var tips = "你还没有输入需兑换金额哦~";
            this.addTipsAssets(tips);
            return;
        }
        var that = this;
        var preFabPath = "prefabs/ddz_window_normal";
        var  comName = "ddz_window_normal";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tipsString = "兑换金币" + draw.drawMoeyString*10000;
            window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tipsString + "</c>",[{title:"取消",callFunc:function () {
            }},{title:"兑换",callFunc:function () {
                ty.NotificationCenter.listen(ddz.EventType.UPDATE_CASH_RESULT,that.onCashResult,this);
                ddz.gameModel.getCashCoin(parseInt(draw.drawMoeyString*100));
            }}]);
        });
    },

    onCashResult : function (argument) {
        ddz.LOGD(null,"cash_cash_cash"+JSON.stringify(argument));
        var result = argument.result;
        var window,lossM;
        if(debugMode && !result.chip && result.code != -1){
        // if(debugMode && !result.chip ){
            hall.MsgFactory.getUserInfo(ddz.GameId);
            window = this.redPacket.getComponent('ddz_getRedPacket');
            // var lossM = hall.GlobalFuncs.getMoneyStringWithCoupons(parseInt(result.value));
            lossM = (parseInt(result.value)/100).toFixed(2) +"";
            window.setRedPacketNumber(lossM);
            ddz.Share.shareKeywordReplace.withDrawMoney = lossM;
            this.withDraw.active = false;
            this.redPacket.active = true;
            this.redBar.active = false;
            this.nowType = 4;
            if (ddz.gameModel.firstWithDrawPoint > 0) {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstWithDraw);
            }
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.firstWithDraw);
            return;
        }

        if (result.chip) {
            var tips = "兑换成功";
            var str = "<img src='ddz_coin_white'/><color=#FFFFFF> " + result.chip + "</c>";
            ddz.GlobalFuncs.playShareZuanShi(result.chip,tips,str);
        }else if (!result.code || result.code != -1) {
            hall.MsgFactory.getUserInfo(ddz.GameId);
            window = this.redPacket.getComponent('ddz_getRedPacket');
            // var lossM = hall.GlobalFuncs.getMoneyStringWithCoupons(parseInt(result.value));
            lossM = (parseInt(result.value)/100).toFixed(2) + "";
            window.setRedPacketNumber(lossM);
            ddz.Share.shareKeywordReplace.withDrawMoney = lossM;
            this.withDraw.active = false;
            this.redPacket.active = true;
            this.redBar.active = false;
            this.nowType = 4;
            if (ddz.gameModel.firstWithDrawPoint > 0) {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstWithDraw);
            }
        }else {
            hall.MsgBoxManager.showToast({"title":result.info});
        }
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.firstWithDraw);
    },

    start:function () {
    },

    update :function(dt) {
    },

    onReciveMessageList: function (result) {
        var list = result.msgs;
        if (typeof(list) != 'undefined'){
            var resultArr = [];
            var addMap;
            var startIndex;
            var endIndex;

            for (var i = 0 ; i < list.length ; i ++){
                var resultMap = list[i];
                var timeS = resultMap.time;
                var textS = resultMap.text;
                if (textS && textS.indexOf("fuhao") == -1) {
                    if (textS.indexOf("提现") > 0){
                        // 恭喜您提现10元至微信现金成功！
                        addMap= {};
                        startIndex = textS.indexOf("提现")+2;
                        endIndex = textS.indexOf("元");
                        addMap.timeS = timeS;
                        addMap.numberString = textS.substring(startIndex,endIndex);;
                        addMap.titleS = "提现";
                        resultArr.push(addMap);
                    }else if (textS.indexOf("宝箱奖励红包券") >= 0){
                        // 恭喜来宾01e3NUsOJ获得20万元奖金彩池奖励红包券69，奖励已下发，继续参加后面的比赛赢取更多奖励吧",
                        addMap= {};
                        startIndex = textS.indexOf("红包券")+3;
                        endIndex = textS.indexOf("红包券");
                        addMap.timeS = timeS;
                        addMap.titleS = "宝箱奖励";
                        // addMap.titleS = textS.substring(startIndex,endIndex);
                        addMap.numberString = textS.substring(endIndex+3);
                        if (Number(addMap.numberString) > 0) {
                            resultArr.push(addMap);
                        }
                    }else if (textS.indexOf("红包券") > 0){
                        // 恭喜来宾01e3NUsOJ获得20万元奖金彩池奖励红包券69，奖励已下发，继续参加后面的比赛赢取更多奖励吧",
                        addMap= {};
                        startIndex = textS.indexOf("获得")+2;
                        endIndex = textS.indexOf("红包券");
                        var endIndex2 = textS.indexOf("，");
                        addMap.timeS = timeS;
                        addMap.titleS = "通关奖励";
                        // addMap.titleS = textS.substring(startIndex,endIndex);
                        addMap.numberString = textS.substring(endIndex+3,endIndex2);
                        if (Number(addMap.numberString) > 0) {
                            resultArr.push(addMap);
                        }
                    }else if (textS.indexOf("奖券") > 0){
                        // "恭喜百万英雄闯关赛闯关成功，获得奖励复活赛门票1张+60万金币+5000奖券和平分20万元奖金的资格",
                        addMap= {};
                        endIndex = textS.indexOf("奖券");
                        startIndex = textS.indexOf("+",endIndex-8) +1;
                        addMap.timeS = timeS;
                        addMap.titleS = "通关固定奖励";
                        addMap.numberString = textS.substring(startIndex,endIndex);
                        resultArr.push(addMap);
                    }else if (textS.indexOf("比赛") >= 0){
                        // "比赛：1元红包赛\n名次：第3名\n奖励：4000金币+0.02元\n奖励已发放，请您查收。",
                        addMap= {};
                        endIndex = textS.indexOf("元\n");
                        startIndex = textS.indexOf("奖励") +3;
                        var str = textS.slice(startIndex,endIndex);
                        if (str.indexOf("+") > 0){
                            var arr = str.split("+");
                            str = arr[arr.length - 1];
                            // startIndex = textS.indexOf("+") + 1;
                        }else {
                            str = textS.substring(startIndex,endIndex);
                        }
                        addMap.timeS = timeS;
                        addMap.titleS = "比赛奖励";
                        addMap.numberString = str * 100;
                        if (endIndex > 0) {
                            resultArr.push(addMap);
                        }
                    }else if (textS.indexOf("牌桌局数") >= 0){
                        // "牌桌局数奖励 0.03元",
                        addMap= {};
                        endIndex = textS.indexOf("元");
                        startIndex = textS.indexOf(" ") +1;
                        addMap.timeS = timeS;
                        addMap.titleS = "牌桌局数奖励";
                        addMap.numberString = textS.substring(startIndex,endIndex) * 100;
                        resultArr.push(addMap);
                    }
                }
            }
            this.setsetOriginalDataArray(resultArr);
        }
    },
    changeDebugMode : function (value) {
        debugMode = value;
        this.refreshDebugBtn();
        wx.setEnableDebug({
            enableDebug : debugMode,
            success:function () {
                console.log('debugMode start!');
            },
            fail:function () {
                console.log('debugMode fail!');
            },
            complete:function () {
                
            }
        });
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.DEBUG_MODE,value);
        this.withDraw.active = !debugMode;
        this.debugNode.active = debugMode;
        if(this.debugNode.active){
            this.nowType = 5;
            var window = this.debugNode.getComponent('ServerManager');
            window.testWithString();
        }else {
            this.nowType = 2;
            window = this.withDraw.getComponent('ddz_getReward_Withdraw');
            window.setLossMoneyNumber();
        }
    },
    onDebug:function () {
        this.debugNode.active = !this.debugNode.active;
        if (this.debugNode.active){
            var window = this.debugNode.getComponent('ServerManager');
            window.testWithString();
        }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});
