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
        scoreLabel : {
            default : null,
            type : cc.Label
        },
        countLabel : {
            default : null,
            type : cc.Label
        },
        nextNode : {
            default : null,
            type : cc.Node
        },
        nextScoreLabel : {
            default : null,
            type : cc.Label
        },
        nextAvatarSprite :{
            default : null,
            type : cc.Sprite
        },
        buttonLabel : {
            default : null,
            type : cc.Label
        },
        diamondButton : {
            default : null,
            type : cc.Button
        },
        isAction : false
    },

    onDiamondButton : function () {
        jump.GlobalFuncs.showDiamondGift(0);
    },
    onCloseButton : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["closeResurgence"]);
        this.node.destroy();
        jump.GlobalFuncs.showGameOverWithMyScore();

    },
    onBlack : function () {
    },
    useDiamond : function () {
        if(jump.gameModel.assetsCounts <= 0){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["noDiamond"]);
            // jump.GlobalFuncs.showNoDiamondToastTip();
            // jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeInviteFriend);
            jump.GlobalFuncs.showDiamondGift(0);
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["useDiamond"]);
            //TODO: 使用钻石复活,扣除钻石数量
            jump.gameModel.consumeAssets(1);
        }
    },
    getResurgenceResult : function (result) {
        if(this.isAction){
            return;
        }
        this.isAction = true;
        if(result.success == 1){
            jump.GlobalFuncs.showGameResurgenceCountDown();
        }else {
            jump.GlobalFuncs.showGameOverWithMyScore();
        }
        jump.gameModel.assetsCounts = result.assetsCounts || 0;
        this.node.destroy();
    },

    ignoreAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["ignore"]);
        jump.GlobalFuncs.showGameOverWithMyScore();
        this.node.destroy();
    },
    onLoad :function() {
        this.nextNode.active = true;
        this.scoreLabel.string = jump.gameModel.totalScore + "米";
        // hall.LOGW("===","====="+jump.gameModel.game_friendData);
        var userDataList = JSON.parse(jump.gameModel.game_friendData);
        var haveNext = false;
        if(userDataList && userDataList.length){
            for (var i = userDataList.length-1 ; i >= 0 ; i --){
                var user = userDataList[i];
                var score = user.sumScore;
                if(user.userId == ty.UserInfo.userId){
                    if(score < jump.gameModel.totalScore && ty.UserInfo.userId != 0){
                        jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
                    }
                }
                if(!haveNext && score > jump.gameModel.totalScore && user.userId != ty.UserInfo.userId){
                    haveNext = true;
                    this.nextScoreLabel.string = score + "米";
                    if(user.avatarUrl && user.avatarUrl != ""){
                        ty.SystemInfo.getImageWithURL(user.avatarUrl,this.nextAvatarSprite);
                    }else {
                        ty.SystemInfo.getImageWithURL("res/raw-assets/resources/table/nopack/rank_avatar_default.png",this.nextAvatarSprite);
                    }
                }
            }
        }else if(ty.UserInfo.userId != 0){
            jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
        }

        if(!haveNext){
            this.nextNode.active = false;
            // this.nextScoreLabel.string = "0" + "分";
            // ty.SystemInfo.getImageWithURL("res/raw-assets/resources/table/nopack/rank_avatar_default.png",this.nextAvatarSprite);
        }

        // var count = hall.GlobalFuncs.getRandomNumberBefore(2);
        var count = jump.gameModel.assetsCounts || 0;
        this.countLabel.string = "x"+count;
        if (count == 0){
            this.buttonLabel.string = "领钻石";
            // this.diamondButton.node.active = true;
        }else {
            this.buttonLabel.string = "使用钻石";
            // this.diamondButton.node.active = false;
        }

        ty.NotificationCenter.listen(jump.EventType.RESURGENCE_RESULT,this.getResurgenceResult ,this);
        // ty.NotificationCenter.listen(jump.EventType.REMOVE_RESURGENCE_WINDOW,this.removeAction ,this);

        // var resuegenceConfig = jump.gameModel.resurgenceConfig || jump.Share.resurgenceConfig;
        // var goOnWindow = resuegenceConfig.goOnWindow;
        // var resurgence ;
        // if(ty.UserInfo.isInBSGS){
        //     resurgence = goOnWindow.bsgsUser;
        // }else {
        //     resurgence = goOnWindow.noBsgsUser;
        // }
        // if(resurgence && resurgence.showType == 1){
        //     jump.GlobalFuncs.showResurgencePanel(resurgence);
        // }
    },
    // removeAction : function () {
    //     this.node.destroy();
    // },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
