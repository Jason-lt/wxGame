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

        title:cc.Label,

        coinNode:cc.Node,
        diamondNode:cc.Node,
        jiPaiQiNode:cc.Node,
    },

    onLoad:function(){
        var ani = this.node.getComponent(cc.Animation);
        ani.play('animan');
    },

    updateRewardInfo:function(coinNum,diamondNum,jipaiqiNum,_count,_title){
        var posList = [-200,0,200];
        if (_count == 2){
            posList = [-150,150];
        }else if (_count == 1) {
            posList = [0];
        }
        var index = 0;

        if(coinNum){
            this.setCoinLable(coinNum);
            if (posList[index] != null) {
                this.coinNode.x = posList[index];
            }
            this.coinNode.active = true;
            index++;
        }
        if(diamondNum){
            this.setDiamondLabel(diamondNum);
            if (posList[index] != null) {
                this.diamondNode.x = posList[index];
            }
            this.diamondNode.active = true;
            index++;
        }
        if(jipaiqiNum){
            this.setJiPaiQiLabel(jipaiqiNum);
            if (posList[index] != null) {
                this.jiPaiQiNode.x = posList[index];
            }
            this.jiPaiQiNode.active = true;
        }
        if (_title) {
            this.title.string = _title;
        }
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
