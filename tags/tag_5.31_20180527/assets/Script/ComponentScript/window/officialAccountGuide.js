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
        tipsRich:cc.RichText,

        guideNode_1:cc.Node,

        guideNode_2:cc.Node,

        hand:cc.Node,
        yindao:cc.Prefab,
    },

    onLoad:function() {
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.hand.y = backButtonH - 50;
        }
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
        },this);

        if (ddz.gameModel.gongZhonghaoCardPoint > 0){
            this.setTipsRich();
        }else if (ddz.gameModel.gongZhonghaoMenuPoint > 0) {
            this.setTipsRich(1);
        }

    },

    onClickStepBtn:function(){
        if (ddz.gameModel.gongZhonghaoCardPoint > 0){
            this.playAttentionAni();
            this.playHandAni();
        }else if (ddz.gameModel.gongZhonghaoMenuPoint > 0) {
            this.playEnterAni();
            this.playHandAni();
        }else {
            ddz.GlobalFuncs.showNormalTipsWindow("今天的免费礼包已领取\n明天奖励更给力哦~",[{title:"确定",callFunc:function () {
            }}],"天天礼包");
        }
    },

    onClickIssueBtn:function(){
        this.playAttentionAni();
        this.guideNode_2.active = false;
        this.guideNode_1.active = true;
        this.guideNode_1.setScale(1);
    },

    // 播放关注公众号步骤
    playAttentionAni:function(){
        this.guideNode_2.active = false;
        this.guideNode_1.active = true;
        this.guideNode_1.setScale(0);
        var actionTime = 0.15;
        var scaleAction = cc.scaleTo(actionTime,1.05);
        var scaleAction_2 = cc.scaleTo(actionTime/3,1);
        this.guideNode_1.runAction(cc.sequence(scaleAction,scaleAction_2,cc.callFunc(function () {

        },this.guideNode_1)));
    },

    // 播放进入公众号步骤
    playEnterAni:function(){
        this.guideNode_2.active = true;
        this.guideNode_1.active = false;
        this.guideNode_2.setScale(0);
        var actionTime = 0.15;
        var scaleAction = cc.scaleTo(actionTime,1.05);
        var scaleAction_2 = cc.scaleTo(actionTime/3,1);
        this.guideNode_2.runAction(cc.sequence(scaleAction,scaleAction_2,cc.callFunc(function () {

        },this.guideNode_2)));
    },

    //
    setTipsRich:function(num){
        if (num && num > 0) {
            this.tipsRich.string = "<color=#1A6B54>每天从公众号菜单进入游戏\n即可领取 </c>" +
                "<img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951> " + num + "</c>";
        }else {
            this.tipsRich.string = "<color=#1A6B54>关注公众号，马上领取钻石礼包</c>";
        }
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
        anim.play();
    },

    playEndAnimation : function () {
        this.isAction = false;
        if (this.yindaoAni) {
            this.yindaoAni.removeFromParent();
        }
        this.node.destroy();
    },

    onClose:function(){
        if (this.isAction) {
            return;
        }
        this.playEndAnimation();
    },

    onCloseAttentionAni:function(){
        this.guideNode_1.active = false;
    },

    onCloseEnterAni:function(){
        this.guideNode_2.active = false;
    },

});
