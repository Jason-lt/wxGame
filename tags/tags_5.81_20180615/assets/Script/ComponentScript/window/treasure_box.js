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
    },

    playAnimationAfterShareWithType : function (type) {
        hall.LOGW("","file = [treasure_box] fun = [playAnimationAfterShareWithType] type = " + type);
        if (type == ddz.Share.onShareType.clickStatShareTypeGiveProp) {
            hall.MsgBoxManager.showToast({title : '宝箱可以重复送给更多的朋友哦~'});  
        }
    },

    clickCenterBtn:function(){
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGiveProp);
    },

    playEndAnimation : function () {
        this.node.destroy();
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

