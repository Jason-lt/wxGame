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
        titleLable: {
            default: null,
            type: cc.Label
        },
        diamondLackTip1: {
            default: null,
            type: cc.Label
        },
        diamondLackTip2: {
            default: null,
            type: cc.Label
        },
        coinLackTip: {
            default: null,
            type: cc.RichText
        },
        shareButton: {
            default: null,
            type: cc.Button
        },
        cancelButton: {
            default: null,
            type: cc.Button
        },
        exchangeButton: {
            default: null,
            type: cc.Button
        },
        exchangeLabel: {
            default: null,
            type: cc.RichText
        }
    },

    onLoad: function() {
        //this.feeType = 'diamond';
        //this.updateByFeeType(this.feeType);
    },

    showCoinView: function(state) {
        this.titleLable.string = state ? "金币不足": "钻石不足";
        this.diamondLackTip1.node.active = !state;
        this.diamondLackTip2.node.active = !state;
        this.coinLackTip.node.active = state;
        this.shareButton.node.active = !state;
        this.cancelButton.node.active = state;
        this.exchangeButton.node.active = state;
    },

    updateByFeeType: function(feeType) {
        if(feeType == 'coin') {
            this.showCoinView(true);
        } else if(feeType == 'diamond') {
            this.showCoinView(false);
        } else {
            hall.LOGE("something error","fix it");
        }
    },


    onClickShare: function() {
        hall.LOGD("onClickShare","test001");
    },

    onClickClose: function() {
        this.node.destroy();
    },

    onClickCancel: function() {
        hall.LOGD("onClickCancel","test001");
        this.node.destroy();
    },

    onClickExchange: function() {
        hall.LOGD("onClickExchange","test001");
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
