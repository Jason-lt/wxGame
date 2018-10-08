// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

/**
 * 收藏桌面引导
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "collectDeskTop";

    },

    properties: {

        bgBtn: {
            default : null,
            type : cc.Button
        },

        closeBtn : {
            default : null,
            type : cc.Button
        },

        hand : cc.Node,

        yindao:cc.Prefab,
    },

    onLoad :function() {
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
            that.yindaoAni = cc.instantiate(this.yindao);
            that.hand.addChild(that.yindaoAni);
            var ani = that.yindaoAni.getComponent(cc.Animation);
            var clipName = ani.getClips()[0].name;
            var anim = ani.getAnimationState(clipName);
            anim.once("finished", function () {
            });
            anim.play();
        },this);
    },

    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
            if (that.yindaoAni) {
                that.yindaoAni.removeFromParent();
            }
            that.node.destroy();
        },this);
        anim1.play();
    },

    onClose:function (event) {
        if (this.isAction) {
            return;
        }
        this.playEndAnimation();
    },


});
