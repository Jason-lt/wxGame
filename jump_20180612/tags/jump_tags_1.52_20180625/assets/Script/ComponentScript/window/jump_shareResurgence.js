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
        resurgence : {}
    },

    onBlackAction : function () {

    },

    setResurgenceConfig : function (resurgence) {
        this.resurgence = resurgence;
    },

    inviteAction : function () {
        if(this.resurgence.resurgenceType == "ad"){

        }else {
            jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeInviteFriendResurgence);
        }
    },

    giveUpAction : function () {
        jump.GlobalFuncs.showGameOverWithMyScore();
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        ty.NotificationCenter.listen(jump.EventType.UPDATE_SHARE_STATE,this.updateShareResult,this);
        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }
    },

    updateShareResult : function (shareType) {
        hall.LOGW("=====","====jump.Share.resultType==="+jump.Share.resultType);
        if(shareType == jump.Share.onShareType.clickStatShareTypeInviteFriendResurgence){
            if(jump.Share.resultType == jump.Share.ShareState.isNotAGroupChat){
                hall.MsgBoxManager.showToast({"title":"需分享到群哟~"});
            }else if(jump.Share.resultType == jump.Share.ShareState.repetitionGroupChat){
                hall.MsgBoxManager.showToast({"title":"频繁分享到一个群影响不好哦~"});
            }else if(jump.Share.resultType == jump.Share.ShareState.suscessShare){
                this.node.destroy();
                ty.NotificationCenter.trigger(jump.EventType.GAME_RESTART,"resurgence");
            }else if(jump.Share.resultType == jump.Share.ShareState.userInfoError){
                hall.LoginToyoo();
                hall.MsgBoxManager.showToast({"title":"当前网络状态不佳"});
            }else if(jump.Share.resultType == jump.Share.ShareState.shareError){
                hall.MsgBoxManager.showToast({"title":"群信息错误"});
            } else {
                hall.MsgBoxManager.showToast({"title":"其他错误"});
            }
        }
    },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // start () {
    //
    // },

    // update (dt) {},
});
