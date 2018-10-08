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
        backBg : {
            default : null,
            type  : cc.Button
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },

        centerButton : {
            default : null,
            type : cc.Button
        },

    },

    onLoad : function () {
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('awad_tips_show');
        anim1.on('finished', function(){
            this.isAction = false;
        },this);
        anim1.play();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TREASURE_BOX, this.playEndAnimation, this);
    },

    playAnimationAfterShareWithType : function (shareType) {
        var bt = ddz.gameModel.getBoxShareSuccessTipsJson();
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeGiveProp) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                var tips_1 = '请分享到微信群哦~';
                if (bt && bt.shareToFriend) {
                    tips_1 = bt.shareToFriend;
                }
                hall.MsgBoxManager.showToast({title : tips_1});
                break;
            case 2:
                var tips_2 = ['点击分享卡片可以获得奖励~'];
                if (bt && bt.shareToCrowd) {
                    tips_2 = bt.shareToCrowd;
                }
                var index = hall.GlobalFuncs.getRandomNumberBefore(tips_2.length);
                hall.MsgBoxManager.showToast({title : tips_2[index]});
                break;
            case 3:
                var tips_2 = ['分享到多个群可以获得多个奖励哦~'];
                if (bt && bt.shareToCrowd) {
                    tips_2 = bt.shareToCrowd;
                }
                var index = hall.GlobalFuncs.getRandomNumberBefore(tips_2.length);
                hall.MsgBoxManager.showToast({title : tips_2[index]});
                break;
                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    clickCenterBtn:function(){
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGiveProp);
    },

    playEndAnimation : function () {
        if (this.node) {
            this.node.destroy();
        }
    },

    onClose:function (event) {
        if (this.isAction){
            return
        }
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});

