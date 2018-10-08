// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        topNode : {
            default : null,
            type : cc.Node
        },
        bottomNode : {
            default : null,
            type : cc.Node
        },

        lastTimeLabel : {
            default : null,
            type : cc.Label
        },
        mainTableView : {
            default : null,
            type : cc.Node
        }
    },

    onLoad : function() {
        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }
        scratch.gameModel.getUserInfoForScratch();
        // this.updateTableView();
        this.updateTime();
        ty.NotificationCenter.listen(scratch.EventType.GET_USER_CARD_INFO,this.updateTableView,this);
        ty.NotificationCenter.listen(scratch.EventType.UPDATE_USER_INFO,this.updateTableView,this);

        ty.NotificationCenter.listen(scratch.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        scratch.AudioHelper.playMusic(scratch.EffectPath_mp3.scratch_bg,true);
    },
    updateTime : function () {
        this.lastTimeLabel.string = "距离卡片刷新还有\n"+ hall.GlobalTimer.getCurLastTime();
        this.timeCountDown = 12;
    },
    updateTableView : function () {
        if(!scratch.GameWorld.normalConfig.showCardList || !scratch.GameWorld.cardListInfo){
            return;
        }
        var i;
        scratch.GameWorld.showCardList = [];
        for (i = 0 ; i < scratch.GameWorld.normalConfig.showCardList.length ; i ++){
            scratch.GameWorld.showCardList.push(scratch.GameWorld.normalConfig.showCardList[i]);
        }
        // scratch.GameWorld.normalConfig.showCardList[1] = "2000";
        var cardID ;
        var listNumber = scratch.GameWorld.showCardList.length;
        var cardInfo;
        if(ty.SystemInfo.isCheckVersion){
            for (i = listNumber-1 ; i >= 0 ; i --){
                cardID = scratch.GameWorld.showCardList[i];
                cardInfo = scratch.GameWorld.cardListInfo[cardID];
                if(cardInfo[4] || cardInfo[1]) {
                    scratch.GameWorld.showCardList.splice(i,1);
                }
            }
        }else {
            if(scratch.GameWorld.newUserCardId){
                if(scratch.GameWorld.showCardList.length > 3){
                    scratch.GameWorld.showCardList.splice(3,listNumber-3);
                }
            }
        }

        listNumber = scratch.GameWorld.showCardList.length;
        for (i = listNumber-1 ; i >= 0 ; i --){
            cardID = scratch.GameWorld.showCardList[i];
            if(hall.ME.udataInfo.m_rewardDailyCards.indexOf(cardID) > -1 || hall.ME.udataInfo.m_rewardLifeCards.indexOf(cardID) > -1 || cardID == "2000") {
                scratch.GameWorld.showCardList.splice(i,1);
            }
        }
        listNumber = scratch.GameWorld.showCardList.length;
        if(!scratch.GameWorld.newUserCardId){
            if(listNumber == 0){
                scratch.GameWorld.showCardList[0] = "2000";
            }else {
                for (i = listNumber-1; i > 0 ; i --){
                    scratch.GameWorld.showCardList[i+1] = scratch.GameWorld.showCardList[i]
                }
                scratch.GameWorld.showCardList[1] = "2000";
            }
        }

        var tableViewCom = this.mainTableView.getComponent("scratch_tableView");
        tableViewCom.removeAllCell();
        tableViewCom.setDataArray(scratch.GameWorld.showCardList);
    },
    giftAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["chipGiftLeft"]);
        scratch.GlobalFuncs.showGoldGift();
    },

    playAnimationAfterShareWithType : function (shareType) {
        if(shareType == scratch.Share.onShareType.maincardclickshare ){
            switch (scratch.Share.resultType){
                case scratch.Share.ShareState.suscessShare : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        scratch.gameModel.scratchCountNow = 0;
                        this.goToCardScratch();
                    }
                    break;
                }
                case scratch.Share.ShareState.failToShare : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        hall.MsgBoxManager.showToast({"title":"分享失败"});
                    }
                    break;
                }
            }
        }
        if(shareType == scratch.Share.onShareType.unbsgsmaincardclick){
            switch (scratch.Share.resultType){
                case scratch.Share.ShareState.isNotAGroupChat : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        hall.MsgBoxManager.showToast({"title":"分享到群免费刮奖"});
                    }
                    break;
                }
                case scratch.Share.ShareState.repetitionGroupChat : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        hall.MsgBoxManager.showToast({"title":"频繁打扰同一个群不礼貌哦！"});
                    }
                    break;
                }
                case scratch.Share.ShareState.suscessShare : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        scratch.gameModel.scratchCountNow = 0;
                        this.goToCardScratch();
                    }
                    break;
                }
                case scratch.Share.ShareState.failToShare : {
                    if(scratch.gameModel.scratchCountNow >= 4){
                        hall.MsgBoxManager.showToast({"title":"分享到群免费刮奖"});
                    }
                    break;
                }
            }
        }
        if(shareType == scratch.Share.onShareType.cardshareunlock){
            switch (scratch.Share.resultType){
                case scratch.Share.ShareState.isNotAGroupChat : {
                    break;
                }
                case scratch.Share.ShareState.repetitionGroupChat : {
                    break;
                }
                case scratch.Share.ShareState.suscessShare : {
                    this.goToCardScratch();
                    break;
                }
                case scratch.Share.ShareState.failToShare : {
                    break;
                }
            }
        }
        if(shareType == scratch.Share.onShareType.unbsgscardshareunlock  ){
            switch (scratch.Share.resultType){
                case scratch.Share.ShareState.isNotAGroupChat : {
                    hall.MsgBoxManager.showToast({"title":"分享到群免费刮奖"});
                    break;
                }
                case scratch.Share.ShareState.repetitionGroupChat : {
                    hall.MsgBoxManager.showToast({"title":"频繁打扰同一个群不礼貌哦！"});
                    break;
                }
                case scratch.Share.ShareState.suscessShare : {
                    this.goToCardScratch();
                    break;
                }
                case scratch.Share.ShareState.failToShare : {
                    hall.MsgBoxManager.showToast({"title":"分享到群免费刮奖"});
                    break;
                }
            }
        }
    },
    checkFourCardOpen : function () {
        if(scratch.gameModel.scratchCountNow >= 4){
            if(scratch.gameModel.nowCardID){
                if(scratch.gameModel.nowCardID == "share"){
                    return;
                }
                this.goToCardScratch();
            }
            scratch.gameModel.scratchCountNow = 0;
        }
    },
    goToCardScratch : function () {
        if(!scratch.gameModel.nowCardID || scratch.gameModel.nowCardID == "share"){
            return;
        }
        var sceneName = 'scratch_scrate';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var com = no.getComponent("scratch_scrate");
            com.setCardID(scratch.gameModel.nowCardID);
        };
        cc.director.loadScene(sceneName,onLaunched);
        scratch.gameModel.scratchCountNow = 0;
    },

    update : function(dt) {
        if(this.timeCountDown){
            this.timeCountDown --;
            if(this.timeCountDown == 0){
                this.updateTime();
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        // this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:

    // start () {
    //
    // },
});
