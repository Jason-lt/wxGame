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
 * 金币场选择玩法
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "choosePlayMode";

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

        whileBottom:cc.Node,

        playModeBtn_1 : {
            default : null,
            type : cc.Button
        },

        playModeBtn_2 : {
            default : null,
            type : cc.Button
        },
    },

    onLoad :function() {
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
        },this);

    },

    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
            that.node.destroy();
        },this);
        anim1.play();
    },

    choosePlayMode:function(event, type){
        switch (type){
            case 'jingdian': // 经典叫3分
                hall.GlobalFuncs.gotoRoomListScene(1);  // 1 金币 2 癞子
                break;
            case 'laizi': // 癞子
                hall.GlobalFuncs.gotoRoomListScene(2);
                break;
        }
    },

    onClose:function (event) {
        if (this.isAction) {
            return;
        }
        this.playEndAnimation();
    },

});
