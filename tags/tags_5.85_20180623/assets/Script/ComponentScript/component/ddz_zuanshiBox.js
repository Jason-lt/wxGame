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
        countNumberLabel : cc.Label,
        typeBg : cc.Sprite,
        typeSpriteFrame : [cc.SpriteFrame],
    },

    onLoad:function(){

    },

    saveBox:function(){
        var ani = this.node.getComponent(cc.Animation);
        ani.play('fangru');
        var that = this;
        ani.once("finished", function () {
            that.onClose();
        });

    },

    setZuanshiNnm:function(_count,isType){
        hall.LOGW("","file = [ddz_zuanshiBox] fun = [setZuanshiNnm] ");
        if (isType == "item:1311"){
            this.typeBg.spriteFrame = this.typeSpriteFrame[0];
        }else if (isType == "user:chip"){
            this.typeBg.spriteFrame = this.typeSpriteFrame[1];
        }
        this.countNumberLabel.string = "x" + _count;

        var ani = this.node.getComponent(cc.Animation);
        ani.play('feibaoxiang');
    },

    stopBoxAni:function(){
        var ani = this.node.getComponent(cc.Animation);
        ani.stop();
    },

    onClose:function(){
        this.stopBoxAni();
        this.node.destroy();
    },

});
