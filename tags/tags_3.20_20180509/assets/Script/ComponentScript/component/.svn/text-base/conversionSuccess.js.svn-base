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
        coinText : {
            default : null,
            type : cc.RichText
        },
        tipsText : {
            default : null,
            type : cc.Label
        }
    },

    onLoad:function () {
        
    },

    updateInfo:function (num) {
        var str = "<img src='ddz_coin_white'/><color=#FFFFFF> " + num + "</c>";
        this.coinText.string = str;
    },

    updateTipsText:function (str){
        this.tipsText.string = str;
    },

    updateCoinText:function(str){
        this.coinText.string = str;
    },
    
    updateDiamondCount : function (num) {
        this.tipsText.string = "领奖成功";
        var str = "<img src='ddz_button_diamond'/><color=#FFFFFF> + " + num + "</c>";
        this.coinText.string = str;
        ty.Timer.setTimer(this, function(){
            if (ddz.tipsNode) {
                ddz.tipsNode.removeFromParent();
                ddz.tipsNode = null;
            }
        }, 3, 0, 0);
    },
    
    removeTips:function(){
        // if (this.node) {
        //     this.node.removeFromParent();
        // }
    }

});
