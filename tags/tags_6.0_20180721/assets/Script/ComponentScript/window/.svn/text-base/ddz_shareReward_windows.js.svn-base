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
        tableView : {
            default : null,
            type : cc.Node
        },
        titleBg : {
            default : null,
            type : cc.Sprite
        },
        titleBgSpriteFrame : [cc.SpriteFrame],
        banner:cc.Node,
        btnLabel:cc.RichText,

        jiantou:cc.Node,

        personalAssets : cc.Node,

    },

    onLoad:function(){
        var that = this;
        this.scheduleOnce(function () {
            var ani = that.banner.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE, this.updateNewRewardMassage, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_FRIEND_TITLE_STATE, this.updateTitleBg, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_WINDOW_ANI, this.onClose, this);
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.shareFriend);

        var _shareType = ddz.Share.onShareType.clickStatShareTypeInviteNewFriend;
        this.btnLabel.string = "<color=#E54D42>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";


        var seq = cc.sequence( cc.moveTo(0.5, cc.p(230, 0)), cc.delayTime(0.5),cc.moveTo(0.5, cc.p(250, 0))).repeatForever();
        this.jiantou.runAction(seq);

        hall.adManager.destroyWidthBannerAd();
        hall.adManager.canShowListSceneBanner = false;

        this.setPersonalAssets();
    },

    setPersonalAssets:function () {
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();
    },

    playAnimationAfterShareWithType : function (type) {
        if (type && type != ddz.Share.onShareType.clickStatShareTypeInviteNewFriend) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                break;
            case 2:
                hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    onShareBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShareFriend"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeInviteNewFriend);
    },

    onHelpBox:function(){
        ddz.isClickOpenBox = true;
        ddz.gameModel.getOpenBox();
    },

    //邀请新人得钻石
    updateNewRewardMassage : function () {
        var that = this;
        requestAnimationFrame(function(){
            var window = that.tableView.getComponent('ddz_tableView');
            window.setDataArray(ddz.gameModel.inviteNewShowList);
        });
    },

    updateTitleBg:function(leftCount){
        if (leftCount == 0) {
            this.titleBg.spriteFrame = this.titleBgSpriteFrame[1];
        }else {
            this.titleBg.spriteFrame = this.titleBgSpriteFrame[0];
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        var curScene = cc.director.getScene();
        if (curScene.name == "RoomListScene" || curScene.name == "MatchListScene") {
            var bc = ddz.gameModel.getRoomListBannerConfigJson();
            if (bc) {
                ty.NotificationCenter.trigger(ddz.EventType.OPEN_BANNER, bc);
            }
        }
    },

    removeLoopAni:function () {
        var ani = this.banner.getComponent(cc.Animation);
        ani.stop();
        this.jiantou.stopAllActions();
    },

    shut:function () {
        this.removeLoopAni();
        this.node.destroy();
    },

    onClose:function(){
        this.shut();
        ddz.ddz_shareReward = null;
    },

});
