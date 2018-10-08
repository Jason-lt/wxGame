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
        bgSpr:cc.Node,
        tips:cc.Label,

    },

    onLoad:function(){

    },

    setTips:function(str){
        this.tips.string = str;
        var t_size = this.tips.node.getContentSize();
        var size = this.bgSpr.getContentSize();
        size.width = t_size.width + 35;
        ty.Timer.setTimer(this, this.closeAction, 5)
    },

    closeAction:function(){
        this.node.destroy();
    },
});
