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
       moneyCountLabel : {
           default : null,
           type : cc.Label
       },
        stateLabel : {
           default : null,
            type : cc.Label
        },
        dateLabel : {
            default : null,
            type : cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        
    },

    addDataWithObject : function (resultObject) {
        this.moneyCountLabel.string = "￥"+resultObject.value;
        this.dateLabel.string = resultObject.time;
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }

    // start () {
    //
    // },

    // update (dt) {},
});
