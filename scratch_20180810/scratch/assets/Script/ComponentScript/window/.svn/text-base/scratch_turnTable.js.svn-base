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

    ctor : function () {
        this.palyManager = null;
    },

    properties: {
        resultLabel : {
            default : null,
            type : cc.Label
        },
        roundSprite : {
            default : null,
            type : cc.Sprite
        },
        buttonLabel : {
            default : null,
            type : cc.Label
        },

        turnButton : {
            default : null,
            type : cc.Button
        },

        resultNumber : 0,
        randomNumber : 0,
        cardID : "",

        countDown : 0,
        resultCountDown : 0,

        haveGetReward : false
    },

    backAction : function () {

        hall.LOGE("======","===backAction====haveGetReward========"+this.haveGetReward);
        if(!this.haveGetReward){
            scratch.gameModel.haveEx = false;
            scratch.gameModel.getLuckyReward(this.cardID);
        }
        this.node.destroy();
    },

    onLoad : function() {
        // if(ty.SystemInfo.isCheckVersion || !scratch.GameWorld.normalConfig.illegalConfig.noCheckState.turnTable){
        //     this.buttonLabel.string = "奖励翻倍";
        // }
        hall.LOGE("======","===onLoad====haveGetReward========"+this.haveGetReward);
        hall.GlobalFuncs.btnScaleEffect(this.turnButton.node,1.13);

        ty.NotificationCenter.listen(scratch.EventType.GET_REWARD_RESULT, this.getRewardResult, this);
        ty.NotificationCenter.listen(scratch.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    getRewardResult : function (result) {
        scratch.gameModel.getLuckyRewardExt(this.cardID);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if(shareType != scratch.Share.onShareType.luckyzhuanpanshare){
            return;
        }
        switch (scratch.Share.resultType){
            case scratch.Share.ShareState.isNotAGroupChat : {
                hall.MsgBoxManager.showToast({"title":"翻倍失败，发送到群才可以哦"});
                break;
            }
            case scratch.Share.ShareState.repetitionGroupChat : {
                hall.MsgBoxManager.showToast({"title":"频繁打扰同一个群不礼貌哦！"});
                break;
            }
            case scratch.Share.ShareState.suscessShare : {
                this.startTurn();
                break;
            }
            case scratch.Share.ShareState.failToGetShareTicket : {
                break;
            }
            case scratch.Share.ShareState.failToShare : {
                hall.MsgBoxManager.showToast({"title":"翻倍失败，发送到群才可以哦"});
                break;
            }
        }
    },

    startTurn : function () {
        var scale_1 = cc.scaleTo(0.2, 1.13);
        var scale_2 = cc.scaleTo(0.2, 1);
        var seq1 = cc.sequence(scale_1, scale_2);

        var action1 = cc.scaleTo(0.2, 1.13);

        var action2 = cc.scaleTo(0.2, 1);
        var action3 = cc.fadeTo(0.5,0);

        var action4 = cc.fadeTo(0.1,255);

        var that = this;
        scratch.AudioHelper.playEffect(scratch.EffectPath_mp3.scratch_turnTable_ready_go);
        this.resultLabel.node.runAction(cc.sequence(seq1,seq1,action1,cc.spawn(action2,action3),action4, cc.callFunc(function () {

            // that.resultLabel.opacity = 255;
            that.countDown = 180;
            that.palyManager = scratch.AudioHelper.playEffect(scratch.EffectPath_mp3.scratch_turnTable,true);

        }, that)));
    },

    onBlack : function () {

    },
    setTurnTableNumber : function (number,cardID) {
        this.resultNumber = number;
        this.cardID = cardID;
    },

    onBegin : function () {
        if(this.haveGetReward){
            return;
        }
        if(!ty.SystemInfo.isCheckVersion && scratch.GameWorld.normalConfig.illegalConfig.noCheckState.turnTable){
            scratch.Share.shareWithType(scratch.Share.onShareType.luckyzhuanpanshare); //转盘分享
        }else {
            this.startTurn();
        }
    },

    afterGetRewardEx : function () {
        hall.LOGE("======","===afterGetRewardEx====haveGetReward========"+this.haveGetReward);
        if(this.palyManager){
            scratch.AudioHelper.stopEffectWithPlayManager(this.palyManager);
        }
        scratch.gameModel.getLuckyReward(this.cardID);
        // scratch.gameModel.getLuckyRewardExt(this.cardID);
        this.haveGetReward = true;
    },

    update : function(dt) {
        if(this.countDown){
            this.countDown --;
            this.roundSprite.node.rotation += 20;

            if(this.countDown == 0){
                this.resultLabel.string = this.resultNumber + "倍";
                this.resultCountDown = 48;
                // this.afterGetRewardEx();
                return;
            }
            if(this.countDown% 10 == 0){
                this.randomNumber = hall.GlobalFuncs.getRandomNumberBefore(5) +2;
                if(this.randomNumber == 6){
                    this.randomNumber = 10;
                }
                this.resultLabel.string = this.randomNumber + "倍";
            }
        }
        if(this.resultCountDown){
            this.resultCountDown -- ;
            if(this.resultCountDown == 0){
                this.afterGetRewardEx();
            }
        }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },

});
