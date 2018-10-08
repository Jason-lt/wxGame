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
        aniNode:cc.Node,
        number:cc.Label,
    },

    onLoad:function(){

    },

    playAni:function(){
        var ani = this.aniNode.getComponent(cc.Animation);
        var anim = ani.getAnimationState("huode_01");
        anim.play();
    },

    stopAni:function(){
        var ani = this.aniNode.getComponent(cc.Animation);
        var anim = ani.getAnimationState("huode_01");
        anim.stop();
    },

    setNumber:function(num){
        this.playAni();
        this.number.string = "x" + num + "元";
    },


    onClose:function(){
        this.stopAni();
        this.node.destroy();
        ddz.rewardAni = null;
    },


    // update (dt) {},
});
