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
        diamondResurgenceNode : cc.Node,
        shareResurgenceNode : cc.Node,
        shareResurgenceTypeLabel : cc.Label,
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
        isAction : false,
        shareResurgence : false,
        diamondButton : cc.Button,
        closeButton : cc.Button,

        rankSprite : cc.Sprite,

        texture:cc.Texture2D,
        spriteFrame:{
            default : null,
            type : cc.SpriteFrame
        }
    },

    // onDiamondButton : function () {
    //     jump.GlobalFuncs.showDiamondGift(0);
    // },
    onCloseButton : function () {
        if(this.diamondButton.node){
            this.diamondButton.node.removeFromParent();
        }
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["closeResurgence"]);
        this.node.destroy();
        jump.GlobalFuncs.showGameOverWithMyScore();
    },
    onBlack : function () {
    },
    useDiamond : function () {
        if(this.shareResurgence){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["shareResurgence"]);
            if(jump.gameModel.resurgenceCount == 2){
                hall.adManager.showRewardedVideo("adunit-8cd7118e9aa59021","Resurgence");
            }else {
                jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeInviteFriendResurgence);
            }
        }else {
            if(jump.gameModel.assetsCounts <= 0){
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["noDiamond"]);
                jump.GlobalFuncs.showNoDiamondToastTip();

            }else {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["useDiamond"]);
                //TODO: 使用钻石复活,扣除钻石数量
                jump.gameModel.consumeAssets(1);
            }
        }
    },
    getResurgenceResult : function (result) {
        hall.LOGW("====","=====getResurgenceResult====");
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
        if(this.diamondButton.node){
            this.diamondButton.node.removeFromParent();
        }
        this.node.destroy();
    },

    ignoreAction : function () {
        if(this.diamondButton.node){
            this.diamondButton.node.removeFromParent();
        }
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["ignore"]);
        jump.GlobalFuncs.showGameOverWithMyScore();
        this.node.destroy();
    },
    onLoad :function() {
        this.nextNode.active = true;
        this.scoreLabel.string = jump.gameModel.totalScore + "米";


        var openDataContext = jump.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 550;
        sharedCanvas.height = 100;

        jump.GlobalFuncs.showOrigin();
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function () {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1/10,1000);
        jump.GlobalFuncs.getTheNextSurpass();
        // hall.LOGW("===","====="+jump.gameModel.game_friendData);
        // var userDataList = JSON.parse(jump.gameModel.game_friendData);
        // var haveNext = false;
        // var haveSelf = false;
        // if(userDataList && userDataList.length){
        //     for (var i = userDataList.length-1 ; i >= 0 ; i --){
        //         var user = userDataList[i];
        //         var score = user.sumScore;
        //         if(user.userId == ty.UserInfo.userId){
        //             haveSelf = true;
        //             if(score < jump.gameModel.totalScore && ty.UserInfo.userId != 0){
        //                 jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
        //                 jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
        //             }else {
        //                 jump.Share.shareKeywordReplace.bestScoreForSelf = score + "";
        //             }
        //         }
        //         if(!haveNext && score > jump.gameModel.totalScore && user.userId != ty.UserInfo.userId){
        //             haveNext = true;
        //             this.nextScoreLabel.string = score + "米";
        //             if(user.avatarUrl && user.avatarUrl != ""){
        //                 ty.SystemInfo.getImageWithURL(user.avatarUrl,this.nextAvatarSprite);
        //             }else {
        //                 ty.SystemInfo.getImageWithURL("res/raw-assets/resources/table/nopack/rank_avatar_default.png",this.nextAvatarSprite);
        //             }
        //         }
        //     }
        // }else if(ty.UserInfo.userId != 0){
        //     jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
        //     jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
        // }
        //
        // if(!haveNext){
        //     this.nextNode.active = false;
        // }
        if(jump.Share.shareKeywordReplace.bestScoreForSelf <= jump.gameModel.totalScore){
            jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
            jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
        }

        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }
        var resuegenceConfig = jump.gameModel.resurgenceConfig || jump.Share.resurgenceConfig;
        var goOnWindow = resuegenceConfig.goOnWindow;
        var resurgence ;
        if(ty.UserInfo.isInBSGS){
            resurgence = goOnWindow.bsgsUser;
        }else {
            resurgence = goOnWindow.noBsgsUser;
        }
        if(resurgence && resurgence.showType == 1){
            // jump.GlobalFuncs.showResurgencePanel(resurgence);

            this.shareResurgence = true;
            this.diamondResurgenceNode.active = false;
            this.shareResurgenceNode.active = true;
            this.closeButton.node.active = false;
            if(jump.gameModel.resurgenceCount == 2 && hall.adManager.canPlay){
                this.buttonLabel.string = "看广告复活";
                this.shareResurgenceTypeLabel.string = "看广告可";
            }else {
                this.buttonLabel.string = "分享到群复活";
                this.shareResurgenceTypeLabel.string = "分享可";
            }
        }else {
            this.shareResurgence = false;
            this.diamondResurgenceNode.active = true;
            this.shareResurgenceNode.active = false;
            this.closeButton.node.active = true;
            var count = jump.gameModel.assetsCounts || 0;
            this.countLabel.string = "x"+count;
            if (count == 0){
                this.buttonLabel.string = "没有钻石";
            }else {
                this.buttonLabel.string = "使用钻石";
            }
            // jump.GlobalFuncs.showGameResultResurgence();
        }

        ty.NotificationCenter.listen(jump.EventType.RESURGENCE_RESULT,this.getResurgenceResult ,this);
        ty.NotificationCenter.listen(jump.EventType.UPDATE_SHARE_STATE,this.updateShareResult,this);
        ty.NotificationCenter.listen(jump.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete , this);
        ty.NotificationCenter.listen(jump.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError , this);
        // ty.NotificationCenter.listen(jump.EventType.REMOVE_RESURGENCE_WINDOW,this.removeAction ,this);

        hall.adManager.showBannerAd("adunit-6c1bd5c19988eaa0");
    },
    rewardVideoComplete : function (isEnd) {
        if(!isEnd){
            hall.MsgBoxManager.showToast({"title":"看完广告就可以复活哦~"});
            return;
        }
        if(this.diamondButton.node){
            this.diamondButton.node.removeFromParent();
        }
        this.node.destroy();
        jump.GlobalFuncs.showGameResurgenceCountDown();
    },
    rewardVideoCompleteError : function (errorMsg) {
        hall.MsgBoxManager.showToast({"title":errorMsg});
    },
    updateShareResult : function (shareType) {
        hall.LOGW("=====","====jump.Share.resultType==="+jump.Share.resultType);
        if(shareType == jump.Share.onShareType.clickStatShareTypeInviteFriendResurgence){
            if(jump.Share.resultType == jump.Share.ShareState.isNotAGroupChat){
                hall.MsgBoxManager.showToast({"title":"需分享到群哟~"});
            }else if(jump.Share.resultType == jump.Share.ShareState.repetitionGroupChat){
                hall.MsgBoxManager.showToast({"title":"频繁分享到一个群影响不好哦~"});
            }else if(jump.Share.resultType == jump.Share.ShareState.suscessShare){
                if(this.diamondButton.node){
                    this.diamondButton.node.removeFromParent();
                }
                this.node.destroy();
                jump.GlobalFuncs.showGameResurgenceCountDown();
                // ty.NotificationCenter.trigger(jump.EventType.GAME_RESTART,"resurgence");
            }else if(jump.Share.resultType == jump.Share.ShareState.userInfoError){
                hall.LoginToyoo();
                hall.MsgBoxManager.showToast({"title":"当前网络状态不佳"});
            }else if(jump.Share.resultType == jump.Share.ShareState.shareError){
                hall.MsgBoxManager.showToast({"title":"分享群失败"});
            } else {
                hall.MsgBoxManager.showToast({"title":"分享失败"});
            }
        }
    },
    // removeAction : function () {
    //     this.node.destroy();
    // },
    onDestroy:function(){
        if(this.diamondButton.node){
            this.diamondButton.node.removeFromParent();
        }
        hall.adManager.destroyBannerAd();
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
