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
        timerLabel : {
            default : null,
            type : cc.Label
        },
        lastNumber : 0
    },

    onLoad :function() {
        this.setCountDownWithNumber();
    },
    setCountDownWithNumber : function () {
        var new_gift_reward = ddz.matchModel.new_gift_reward;
        ddz.Share.shareKeywordReplace.newerTreasureID = new_gift_reward.giftId;

        this.lastNumber = parseInt(new_gift_reward.cdTime)*10;
        this.timerLabel.string = hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        if(new_gift_reward.isFirst){
            this.onCenterButton();
        }
        ty.Timer.setTimer(this,this.countDown,0.1,this.lastNumber);

    },
    countDown : function () {
        this.lastNumber --;
        if(this.lastNumber > 0 ){
            this.timerLabel.string = hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        }else {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    onCenterButton : function () {
        hall.GlobalFuncs.onNewUserGifts(this.lastNumber);
    },
    onDestroy : function () {
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:


    // start () {
    //
    // },

    // update (dt) {},
});
