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
        coinLabel:cc.Label,
        diamondLabel:cc.Label,
        jiPaiQiLabel:cc.Label,
    },

    onLoad:function(){
        var ani = this.node.getComponent(cc.Animation);
        ani.play('animan');
    },

    setCoinLable:function(num){
        this.coinLabel.string = num;
    },

    setDiamondLabel:function(num){
        this.diamondLabel.string = num;
    },

    setJiPaiQiLabel:function(num){
        this.jiPaiQiLabel.string = num;
    },

    onClickCenterBtn:function(){
        this.onClose();
    },

    stopAni:function(){
        var ani = this.node.getComponent(cc.Animation);
        ani.stop();
    },

    onClose:function(){
        this.stopAni();
        this.node.destroy();
    },

});
