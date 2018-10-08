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
        detailText : {
            default : null,
            type : cc.RichText
        }
    },

    onLoad : function () {
        ty.Timer.setTimer(this,this.cancelDismiss,3);
    },

    setTipsSString : function (tips) {
        this.detailText.string = "<color=#ffffff>"+tips+"</c>";
    },

    setDissolveFailDetailTextString : function (nameA,success) {

        var nameString = "";
        for (var i = 0 ; i < nameA.length ; i ++){
            if (i == 0){
                nameString = nameString + nameA[i];
            }else {
                nameString = nameString + " 、 "+nameA[i];
            }
        }
        var successString = "";
        if (success){
            successString = "<color=#ffffff>同意解散牌桌</c>"
        }else {
            successString = "<color=#ffffff>不同意解散牌桌,请继续游戏</c>";
        }
        this.detailText.string = "<color=#ffffff>玩家 </c><color=#fff888>"+nameString+"</color><br/>"+successString;
    },
    cancelDismiss : function () {
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_END_RESULT_SHOW);
        this.node.removeFromParent();
    },
    onDestory : function () {
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},



    // update (dt) {},
});
