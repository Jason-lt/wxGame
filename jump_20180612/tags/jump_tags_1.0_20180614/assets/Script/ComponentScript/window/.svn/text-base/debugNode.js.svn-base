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
        numberEditBox : {
            default : null,
            type : cc.EditBox
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onBlack : function () {

    },
    onLoad : function() {
        this.numberEditBox.node.on("text-changed",this.numberEditChange,this);
        this.numberEditBox.node.on("editing-did-ended",this.numberEditEnd,this);
        this.numberEditBox.string = "0";
    },
    numberEditChange:function (event) {
        var changedString = event.detail.string;
        this.numberEditBox.string = changedString;
    },

    numberEditEnd : function (event) {
        var changedString = event.detail.string;
        this.numberEditBox.string = changedString;
        if(changedString == '2180613'){
            // // this.node.removeFromParent(true);
            this.node.destroy();
        }
    },

    updateScoreCloud : function () {
        jump.gameModel.totalScore = this.numberEditBox.string;
        jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
    },

    changeInitScore : function () {
        var score = parseInt(this.numberEditBox.string);
        jump.gameModel.initScore = score;
    }

    // update (dt) {},
});
