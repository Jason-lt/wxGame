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
        guideNode_1:cc.Node,

        guideNode_2:cc.Node,

        guideNode_3:cc.Node,

        guideNode_4:cc.Node,

        hand:cc.Node,
        yindao:cc.Prefab,

        iosText:cc.RichText,
        androidText:cc.RichText,
    },

    onLoad:function() {

        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.gongZhongHaoCard);
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.gongZhongHaoMenu);
        
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.hand.y = backButtonH - 30;
        }
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
        },this);

        this.playHandAni();
        
    },

    openWindow:function(){
        this.guideNode_4.active = false;

        if (ddz.gameModel.gongZhonghaoCardPoint > 0){
            this.playAttentionAni();
        }else if (ddz.gameModel.gongZhonghaoMenuPoint > 0) {
            this.playGetDayRewardAni();
        }else {
            ddz.GlobalFuncs.showNormalTipsWindow("今天的免费礼包已领取\n明天奖励更给力哦~",[{title:"确定",callFunc:function () {
            }}],"天天礼包");
        }

        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }

        // if (hall.sxAdManager) {
        //     hall.sxAdManager.hide();
        // }
    },

    onClickIssueBtn:function(){
        this.playEnterAni();
    },

    // 关注公众号步骤
    playAttentionAni:function(){
        this.guideNode_2.active = false;
        this.guideNode_3.active = false;
        this.guideNode_1.active = true;
        this.guideNode_1.setScale(0);
        var actionTime = 0.15;
        var scaleAction = cc.scaleTo(actionTime,1.05);
        var scaleAction_2 = cc.scaleTo(actionTime/3,1);
        this.guideNode_1.runAction(cc.sequence(scaleAction,scaleAction_2));
    },

    // 进入公众号步骤
    playEnterAni:function(){
        this.guideNode_2.active = false;
        this.guideNode_1.active = false;
        this.guideNode_3.active = true;
        this.guideNode_3.setScale(0);
        var actionTime = 0.15;
        var scaleAction = cc.scaleTo(actionTime,1.05);
        var scaleAction_2 = cc.scaleTo(actionTime/3,1);
        this.guideNode_3.runAction(cc.sequence(scaleAction,scaleAction_2));
        this.setTipsRich();
    },

    //加入小程序领钻石
    addAppletGetDiamond:function(){
        this.guideNode_2.active = false;
        this.guideNode_1.active = false;
        this.guideNode_3.active = false;
        this.guideNode_4.active = true;
        hall.adManager.destroyWidthBannerAd();
    },

    //
    setTipsRich:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.androidText.node.active = true;
            this.iosText.node.active = false;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this.androidText.node.active = false;
            this.iosText.node.active = true;
        }else {
            this.androidText.node.active = true;
            this.iosText.node.active = false;
        }

    },

    // 领取天天礼包
    playGetDayRewardAni:function(){
        this.guideNode_2.active = true;
        this.guideNode_1.active = false;
        this.guideNode_3.active = false;
        this.guideNode_2.setScale(0);
        var actionTime = 0.15;
        var scaleAction = cc.scaleTo(actionTime,1.05);
        var scaleAction_2 = cc.scaleTo(actionTime/3,1);
        this.guideNode_2.runAction(cc.sequence(scaleAction,scaleAction_2));
    },

    // 播放小手动画
    playHandAni:function(){
        if (this.yindaoAni){
            return;
        }
        this.yindaoAni = cc.instantiate(this.yindao);
        this.hand.addChild(this.yindaoAni);
        var ani = this.yindaoAni.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {
        });
        this.hand.setScale(0.5);
        anim.play();
    },

    playEndAnimation : function () {
        this.isAction = false;
        if (this.yindaoAni) {
            var ani = this.yindaoAni.getComponent(cc.Animation);
            ani.stop();
            this.yindaoAni.removeFromParent();
            this.yindaoAni = null;
        }
        if (this.node) {
            this.node.destroy();
        }
    },

    onClose:function(){
        ddz.LOGD(null,"file = [officialAccountGuide] fun = [onClose]");
        if (this.isAction) {
            return;
        }
        this.playEndAnimation();
    },

    onCloseGetRewardWindow:function(){
        // ddz.LOGD(null,"file = [officialAccountGuide] fun = [onCloseGetRewardWindow]");
        this.guideNode_2.stopAllActions();
        this.guideNode_1.stopAllActions();
        this.guideNode_2.active = true;
        this.guideNode_3.active = false;
        this.guideNode_1.active = false
    },

    onDestroy : function () {
        if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
        }
    },

});
