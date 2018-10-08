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
        countLabel : {
            default : null,
            type : cc.Label
        },
        count : 3
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        ty.Timer.setTimer(this,this.countDown,1,4);
    },
    onBlack : function () {

    },
    countDown : function () {
        this.count -- ;
        if(this.count >= 0){
            this.countLabel.string = this.count + "";
        }else {
            ty.Timer.cancelTimer(this,this.countDown);
            ty.NotificationCenter.trigger(jump.EventType.GAME_RESTART,"resurgence");
            this.node.destroy();
        }
    }


    // update (dt) {},
});
